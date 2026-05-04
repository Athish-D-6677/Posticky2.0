import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // login | signup | forgot
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // After login check claim + Firestore role and redirect accordingly
  const redirectByRole = async (firebaseUser) => {
    const token = await firebaseUser.getIdTokenResult(true)
    if (token.claims.admin) {
      navigate('/admin/dashboard', { replace: true })
      return
    }
    // Fallback: check Firestore role
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password)
        await redirectByRole(cred.user)
      } else if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
        await updateProfile(cred.user, { displayName: form.name })
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: form.name,
          email: form.email,
          phone: '',
          role: 'user',
          addresses: [],
          wishlist: [],
          createdAt: serverTimestamp(),
        })
        await redirectByRole(cred.user)
      } else {
        await sendPasswordResetEmail(auth, form.email)
        setInfo('Password reset email sent! Check your inbox.')
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: cred.user.displayName,
        email: cred.user.email,
        phone: '',
        role: 'user',
        addresses: [],
        wishlist: [],
        createdAt: serverTimestamp(),
      }, { merge: true })
      await redirectByRole(cred.user)
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {mode === 'login' ? 'Sign in to continue to Posticky' : mode === 'signup' ? 'Join the Posticky family' : 'Enter your email to reset password'}
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-xl">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-4 text-center bg-green-50 dark:bg-green-900/20 py-2 px-3 rounded-xl">{info}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')} required className="input" />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required className="input" />
          {mode !== 'forgot' && (
            <input type="password" placeholder="Password" value={form.password} onChange={set('password')} required className="input" />
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Email'}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full border border-gray-200 dark:border-gray-600 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('forgot'); setError('') }} className="hover:underline">Forgot password?</button>
              <button onClick={() => { setMode('signup'); setError('') }} className="hover:underline">Don't have an account? Sign up</button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => { setMode('login'); setError('') }} className="hover:underline">Already have an account? Sign in</button>
          )}
          {mode === 'forgot' && (
            <button onClick={() => { setMode('login'); setError('') }} className="hover:underline">Back to sign in</button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
