import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, isAdmin, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && user && isAdmin) navigate('/admin/dashboard', { replace: true })
  }, [loading, user, isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password)
      // Force refresh token to get latest custom claims
      const token = await cred.user.getIdTokenResult(true)
      if (!token.claims.admin) {
        await auth.signOut()
        setError('Access denied. This account does not have admin privileges.')
        return
      }
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Invalid email or password.')
      } else if (msg.includes('too-many-requests')) {
        setError('Too many attempts. Please wait a moment.')
      } else {
        setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim() || 'Login failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#080808', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88' }} />
      </div>
    )
  }

  return (
    <div
      style={{ background: '#080808', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full opacity-6 blur-3xl pointer-events-none" style={{ background: '#00ff88' }} />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-4 blur-3xl pointer-events-none" style={{ background: '#ff2d78' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(17,17,17,0.97)',
            border: '1px solid rgba(0,255,136,0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1 mb-3">
              <span style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em', textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>POST</span>
              <span style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em' }}>ICKY</span>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)' }}
            >
              {/* Shield icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#ff2d78" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontFamily: 'Syne, sans-serif', color: '#ff2d78', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}>ADMIN PANEL</span>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 px-4 py-3 rounded-xl text-xs text-center"
                style={{
                  background: 'rgba(255,45,120,0.08)',
                  border: '1px solid rgba(255,45,120,0.25)',
                  color: '#ff2d78',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                placeholder="admin@posticky.in"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0f0f0',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.06)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 pr-10"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f0f0f0',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#444' }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 mt-1"
              style={{
                fontFamily: 'Syne, sans-serif',
                background: submitting ? 'rgba(0,255,136,0.08)' : 'rgba(0,255,136,0.12)',
                border: '1px solid rgba(0,255,136,0.4)',
                color: '#00ff88',
                boxShadow: submitting ? 'none' : '0 0 20px rgba(0,255,136,0.15)',
                opacity: submitting ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,255,136,0.22)' }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,255,136,0.12)' }}
            >
              {submitting ? 'Verifying...' : 'Access Dashboard →'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}>
            Admin access only · Posticky 2.0
          </p>
        </div>

        {/* Admin claim hint */}
        <div
          className="mt-4 p-4 rounded-2xl text-xs text-center"
          style={{ background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.15)', color: '#ff9500', fontFamily: 'DM Sans, sans-serif' }}
        >
          ⚠️ Make sure your account has the <strong>admin</strong> custom claim set in Firebase Console → Authentication → Custom Claims
        </div>
      </motion.div>
    </div>
  )
}