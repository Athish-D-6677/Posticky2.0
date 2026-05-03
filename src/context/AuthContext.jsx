import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
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
            const token = await firebaseUser.getIdTokenResult()
            setIsAdmin(!!token.claims.admin)
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

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    // Create user doc in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      wishlist: [],
      addresses: [],
    }, { merge: true })
    return cred
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    // Create user doc if first time
    const ref = doc(db, 'users', cred.user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        displayName: cred.user.displayName || '',
        email: cred.user.email || '',
        createdAt: serverTimestamp(),
        wishlist: [],
        addresses: [],
      })
    }
    return cred
  }

  const logout = () => signOut(auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '2px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88' }}
        />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)