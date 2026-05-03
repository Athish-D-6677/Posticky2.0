import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import ReviewCard from '../components/ReviewCard'

const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Unique Designs' },
  { value: '4.9★', label: 'Avg Rating' },
  { value: '48hr', label: 'Fast Delivery' },
]

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Order processed & shipped within 48 hours' },
  { icon: '🎨', title: 'Custom Designs', desc: 'Upload your own artwork for stickers & tees' },
  { icon: '💎', title: 'Premium Quality', desc: 'Vinyl-grade stickers, 100% cotton tees' },
  { icon: '🔒', title: 'Secure Payments', desc: 'UPI, Cards, COD — all payment methods' },
]

export default function Home() {
  const [bestsellers, setBestsellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [reviews, setReviews] = useState([])
  const [ticker, setTicker] = useState(0)
  const tickerRef = useRef(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'products'), where('isActive', '==', true), orderBy('createdAt', 'desc'), limit(8))
        )
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setBestsellers(all.slice(0, 4))
        setNewArrivals(all.slice(4, 8).length ? all.slice(4, 8) : all.slice(0, 4))
      } catch (e) {
        console.log('Products load error:', e)
      }
    }
    const loadReviews = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(6)))
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {}
    }
    loadProducts()
    loadReviews()
  }, [])

  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => setTicker(t => t + 1), 3000)
    return () => clearInterval(interval)
  }, [])

  const tickerItems = ['FREE SHIPPING ABOVE ₹499', 'CUSTOM ORDERS WELCOME', 'PREMIUM VINYL STICKERS', '100% COTTON T-SHIRTS', 'COD AVAILABLE']

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>

      {/* Announcement ticker */}
      <div
        className="overflow-hidden py-2 text-xs font-bold tracking-widest"
        style={{
          background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
          color: '#000',
          fontFamily: 'Syne, sans-serif',
        }}
      >
        <div className="flex gap-12 animate-none whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span>◆</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
        {/* Background grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#00ff88' }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: '#ff2d78' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest"
            style={{
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              color: '#00ff88',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            NOW LIVE IN INDIA
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-6"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <span style={{ color: '#f0f0f0' }}>WEAR IT.</span>
            <br />
            <span style={{
              color: '#00ff88',
              textShadow: '0 0 40px rgba(0,255,136,0.4)',
            }}>STICK IT.</span>
            <br />
            <span style={{ color: '#f0f0f0' }}>OWN IT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg max-w-lg mb-10 leading-relaxed"
            style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
          >
            Premium wall stickers & custom printed T-shirts crafted for those who refuse to blend in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/shop"
              className="btn-neon px-8 py-3.5 text-sm"
            >
              Shop Collection →
            </Link>
            <Link
              to="/custom-order"
              className="btn-outline-neon px-8 py-3.5 text-sm"
            >
              Custom Order
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-2xl"
          >
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="text-2xl font-extrabold"
                  style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.3)' }}
                >
                  {s.value}
                </span>
                <span className="text-xs mt-1" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY TILES ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Stickers */}
          <Link
            to="/stickers"
            className="group relative rounded-3xl overflow-hidden flex flex-col justify-end p-8 transition-all duration-300"
            style={{
              height: '320px',
              background: 'linear-gradient(135deg, #0d1f0d 0%, #0a1a0a 100%)',
              border: '1px solid rgba(0,255,136,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid rgba(0,255,136,0.4)'
              e.currentTarget.style.boxShadow = '0 0 50px rgba(0,255,136,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid rgba(0,255,136,0.15)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-20 blur-xl" style={{ background: '#00ff88' }} />
            <div className="absolute top-4 right-4 text-7xl opacity-30 group-hover:opacity-50 transition-opacity">🎭</div>

            <div className="relative">
              <span
                className="text-xs font-bold tracking-widest mb-2 block"
                style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
              >
                COLLECTION 01
              </span>
              <h3
                className="text-3xl font-extrabold mb-2"
                style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
              >
                Wall Stickers
              </h3>
              <p className="text-sm mb-4" style={{ color: '#666' }}>Transform any boring space instantly</p>
              <span
                className="inline-flex items-center gap-2 text-xs font-bold"
                style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
              >
                Explore →
              </span>
            </div>
          </Link>

          {/* T-Shirts */}
          <Link
            to="/tshirts"
            className="group relative rounded-3xl overflow-hidden flex flex-col justify-end p-8 transition-all duration-300"
            style={{
              height: '320px',
              background: 'linear-gradient(135deg, #1a0d18 0%, #120a10 100%)',
              border: '1px solid rgba(255,45,120,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid rgba(255,45,120,0.4)'
              e.currentTarget.style.boxShadow = '0 0 50px rgba(255,45,120,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid rgba(255,45,120,0.15)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-20 blur-xl" style={{ background: '#ff2d78' }} />
            <div className="absolute top-4 right-4 text-7xl opacity-30 group-hover:opacity-50 transition-opacity">👕</div>

            <div className="relative">
              <span
                className="text-xs font-bold tracking-widest mb-2 block"
                style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}
              >
                COLLECTION 02
              </span>
              <h3
                className="text-3xl font-extrabold mb-2"
                style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
              >
                T-Shirts
              </h3>
              <p className="text-sm mb-4" style={{ color: '#666' }}>Wear your story. Make it loud.</p>
              <span
                className="inline-flex items-center gap-2 text-xs font-bold"
                style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}
              >
                Explore →
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ── BESTSELLERS ── */}
      {bestsellers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <span
                className="text-xs font-bold tracking-widest block mb-1"
                style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
              >
                TOP PICKS
              </span>
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
              >
                Bestsellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium transition-colors"
              style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.color = '#666'}
            >
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestsellers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURES STRIP ── */}
      <section
        className="py-12 px-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2 p-4"
            >
              <span className="text-3xl">{f.icon}</span>
              <h4
                className="text-sm font-bold"
                style={{ fontFamily: 'Syne, sans-serif', color: '#e0e0e0' }}
              >
                {f.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <span
                className="text-xs font-bold tracking-widest block mb-1"
                style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}
              >
                JUST DROPPED
              </span>
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
              >
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium transition-colors"
              style={{ color: '#666' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff2d78'}
              onMouseLeave={e => e.currentTarget.style.color = '#666'}
            >
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #0d1f0d 0%, #0a0a1a 50%, #1a0d18 100%)',
            border: '1px solid rgba(0,255,136,0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #00ff88 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ff2d78 0%, transparent 50%)`
          }} />
          <div className="relative">
            <h2
              className="text-3xl md:text-5xl font-extrabold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
            >
              Got a custom idea?
            </h2>
            <p className="mb-8 text-base" style={{ color: '#777' }}>
              We print anything — your logo, your art, your vibe. Minimum 1 piece.
            </p>
            <Link to="/custom-order" className="btn-neon px-10 py-4 text-sm">
              Start Custom Order →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span
              className="text-xs font-bold tracking-widest block mb-1"
              style={{ color: '#00d4ff', fontFamily: 'Syne, sans-serif' }}
            >
              SOCIAL PROOF
            </span>
            <h2
              className="text-2xl md:text-3xl font-extrabold"
              style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}
            >
              What People Say
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ReviewCard review={r} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTER NOTE ── */}
      <div
        className="text-center py-6 text-xs"
        style={{ color: '#444', borderTop: '1px solid rgba(255,255,255,0.04)', fontFamily: 'DM Sans, sans-serif' }}
      >
        Made with 🖤 in India · Posticky 2.0
      </div>
    </div>
  )
}