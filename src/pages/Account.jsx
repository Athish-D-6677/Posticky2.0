import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'My Orders' },
  { id: 'addresses', label: 'Addresses' },
]

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Profile form
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!user) return
    setDisplayName(user.displayName || '')
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        const data = snap.data() || {}
        setUserData(data)
        setPhone(data.phone || '')
      } catch (e) {}
    }
    load()
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateProfile(user, { displayName })
      await updateDoc(doc(db, 'users', user.uid), { phone, displayName })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.log(e)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = (displayName || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>
              MY ACCOUNT
            </span>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
              {user?.displayName || user?.email?.split('@')[0] || 'Account'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl transition-all duration-200"
            style={{ color: '#ff2d78', border: '1px solid rgba(255,45,120,0.2)', fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">

            {/* Avatar card */}
            <div
              className="rounded-2xl p-5 mb-4 text-center"
              style={{ background: '#111', border: '1px solid rgba(0,255,136,0.12)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,212,255,0.2))',
                  border: '2px solid rgba(0,255,136,0.3)',
                  color: '#00ff88',
                  fontFamily: 'Syne, sans-serif',
                  textShadow: '0 0 12px rgba(0,255,136,0.5)',
                }}
              >
                {initials}
              </div>
              <p className="font-bold text-sm" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                {user?.email}
              </p>
            </div>

            {/* Nav tabs */}
            <div className="flex flex-col gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    background: activeTab === tab.id ? 'rgba(0,255,136,0.08)' : 'transparent',
                    color: activeTab === tab.id ? '#00ff88' : '#888',
                    border: activeTab === tab.id ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <Link
                to="/wishlist"
                className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#888' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff2d78'}
                onMouseLeave={e => e.currentTarget.style.color = '#888'}
              >
                Wishlist
              </Link>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
            >

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
                    Profile Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                        DISPLAY NAME
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f0', fontFamily: 'DM Sans, sans-serif' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f0', fontFamily: 'DM Sans, sans-serif' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: '#666', fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#555', fontFamily: 'DM Sans, sans-serif', cursor: 'not-allowed' }}
                      />
                      <p className="text-xs mt-1" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>Email cannot be changed.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn-neon px-6 py-2.5 text-sm"
                      style={{ opacity: saving ? 0.7 : 1 }}
                    >
                      {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-lg font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
                    My Orders
                  </h2>
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#00ff88" strokeWidth={1.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm mb-5" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>View all your order history</p>
                    <Link to="/my-orders" className="btn-neon px-6 py-2.5 text-sm">View All Orders →</Link>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-lg font-extrabold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
                    Saved Addresses
                  </h2>
                  {userData?.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.addresses.map((addr, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <p className="font-bold text-sm mb-1" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>{addr.name}</p>
                          <p className="text-xs leading-relaxed" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                        No saved addresses yet. Your checkout addresses will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}