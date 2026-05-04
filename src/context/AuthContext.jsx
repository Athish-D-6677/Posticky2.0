import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub
    try {
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Check Firebase Custom Claim first
            const token = await firebaseUser.getIdTokenResult(true)
            let admin = !!token.claims.admin

            // Fallback: check Firestore role field if no custom claim
            if (!admin) {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
              if (userDoc.exists() && userDoc.data().role === 'admin') {
                admin = true
              }
            }

            setIsAdmin(admin)
            setUser(firebaseUser)
          } else {
            setUser(null)
            setIsAdmin(false)
          }
        } catch {
          setUser(null)
          setIsAdmin(false)
        } finally {
          setLoading(false)
        }
      }, () => {
        setLoading(false)
      })
    } catch {
      setLoading(false)
    }
    return () => unsub?.()
  }, [])

  const logout = () => signOut(auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
