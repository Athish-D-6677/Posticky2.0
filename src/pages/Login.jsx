import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, name)
      }
      navigate('/')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Something went wrong.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed.')
    }
    setLoading(false)
  }

  return (
    <div
      style={{ background: '#080808', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16"
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orbs */}
      <div className="fixed top-1/3 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#00ff88' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#ff2d78' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(17,17,17,0.95)',
            border: '1px solid rgba(0,255,136,0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-1 mb-6">
              <span style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em', textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>POST</span>
              <span style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em' }}>ICKY</span>
            </Link>
            <h1
              className="text-2xl font-extrabold mt-2"
              style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
            >
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
              {mode === 'login' ? 'Sign in to your Posticky account' : 'Join the Posticky family'}
            </p>
          </div>

          {/* Mode toggle */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  background: mode === m ? 'rgba(0,255,136,0.12)' : 'transparent',
                  color: mode === m ? '#00ff88' : '#666',
                  border: mode === m ? '1px solid rgba(0,255,136,0.25)' : '1px solid transparent',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-5 text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ccc',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 15.1l6.6 4.8C14.5 16.1 18.9 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 16.3 5 9.6 9.1 6.3 15.1z"/>
              <path fill="#4CAF50" d="M24 45c5 0 9.4-1.9 12.8-4.9l-5.9-5c-1.8 1.3-4.1 2-6.9 2-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 40.7 16.2 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l5.9 5C36.9 39.6 44 34 44 25c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: '#888', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
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
            )}

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#888', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
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

            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#888', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
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

            {error && (
              <p
                className="text-xs px-4 py-3 rounded-xl"
                style={{ color: '#ff6b6b', background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', fontFamily: 'DM Sans, sans-serif' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3.5 text-sm mt-1"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs mt-4" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError('') }}
                style={{ color: '#00ff88' }}
                className="font-medium"
              >
                Sign up free
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}