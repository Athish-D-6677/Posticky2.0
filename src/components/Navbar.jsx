import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/stickers', label: 'Stickers' },
  { to: '/tshirts', label: 'T-Shirts' },
  { to: '/custom-order', label: 'Custom' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(8,8,8,0.95)'
          : 'rgba(8,8,8,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0,255,136,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <span
            className="text-xl font-extrabold tracking-widest"
            style={{
              fontFamily: 'Syne, sans-serif',
              color: '#00ff88',
              textShadow: '0 0 20px rgba(0,255,136,0.5)',
              letterSpacing: '0.15em',
            }}
          >
            POST
          </span>
          <span
            className="text-xl font-extrabold tracking-widest"
            style={{
              fontFamily: 'Syne, sans-serif',
              color: '#f0f0f0',
              letterSpacing: '0.15em',
            }}
          >
            ICKY
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: isActive(l.to) ? '#00ff88' : '#999',
                background: isActive(l.to) ? 'rgba(0,255,136,0.08)' : 'transparent',
                textShadow: isActive(l.to) ? '0 0 12px rgba(0,255,136,0.4)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive(l.to)) e.currentTarget.style.color = '#f0f0f0'
              }}
              onMouseLeave={e => {
                if (!isActive(l.to)) e.currentTarget.style.color = '#999'
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Cart */}
          <Link
            to={user ? '/cart' : '/login'}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: '#999' }}
            onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
            onMouseLeave={e => e.currentTarget.style.color = '#999'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.8)' }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          {user && (
            <Link
              to="/wishlist"
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
              style={{ color: '#999' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff2d78'}
              onMouseLeave={e => e.currentTarget.style.color = '#999'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          )}

          {/* Login / User */}
          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/my-orders"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ color: '#ccc', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
              >
                My Orders
              </Link>
              <Link
                to="/account"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 max-w-[120px] truncate"
                style={{ color: '#ccc', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
              >
                {user.displayName || user.email?.split('@')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ color: '#ff2d78', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,120,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:flex btn-neon text-xs px-4 py-2"
            >
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition"
            style={{ color: '#999' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden px-4 py-4 flex flex-col gap-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.98)' }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: isActive(l.to) ? '#00ff88' : '#aaa',
                background: isActive(l.to) ? 'rgba(0,255,136,0.08)' : 'transparent',
              }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user ? (
            <>
                <Link to="/my-orders" className="px-3 py-2.5 rounded-xl text-sm font-medium" style={{ color: isActive('/my-orders') ? '#00ff88' : '#aaa', background: isActive('/my-orders') ? 'rgba(0,255,136,0.08)' : 'transparent', fontFamily: 'DM Sans' }}>📦 My Orders</Link>
                <Link to="/account" className="px-3 py-2.5 rounded-xl text-sm" style={{ color: '#aaa', fontFamily: 'DM Sans' }}>👤 My Account</Link>
                <Link to="/wishlist" className="px-3 py-2.5 rounded-xl text-sm" style={{ color: '#aaa', fontFamily: 'DM Sans' }}>❤️ Wishlist</Link>
                <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-xl text-sm" style={{ color: '#ff2d78', fontFamily: 'DM Sans' }}>🚪 Logout</button>
            </>
            ) : (
              <Link to="/login" className="btn-neon text-center text-sm py-3">Login / Sign Up</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}