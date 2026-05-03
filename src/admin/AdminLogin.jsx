import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, isAdmin, loading } = useAuth()
  const [form, setForm] = useState({ email: 'athii6677@gmail.com', password: 'Athish@6677' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Apply dark mode from localStorage (no Navbar here)
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  // If already logged in as admin, redirect straight to dashboard
  useEffect(() => {
    if (!loading && user && isAdmin) navigate('/admin/dashboard', { replace: true })
  }, [loading, user, isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password)
      const token = await cred.user.getIdTokenResult()
      if (!token.claims.admin) {
        await auth.signOut()
        setError('Unauthorized access. Admin only.')
        return
      }
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim())
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <p className="text-2xl font-extrabold text-purple-500 tracking-tight">POSTICKY</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-500 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-600 transition disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Login to Admin'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
