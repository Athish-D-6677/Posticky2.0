import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'

const THEMES = [
  { label: 'All', value: 'all', icon: '✨' },
  { label: 'Movie', value: 'movie', icon: '🎬' },
  { label: 'Series', value: 'series', icon: '📺' },
  { label: 'Music', value: 'music', icon: '🎵' },
  { label: 'Car', value: 'car', icon: '🚗' },
  { label: 'Bike', value: 'bike', icon: '🏍️' },
  { label: 'Gaming', value: 'gaming', icon: '🎮' },
  { label: 'Anime', value: 'anime', icon: '⛩️' },
  { label: 'Quotes', value: 'quotes', icon: '💬' },
  { label: 'Gym', value: 'gym', icon: '💪' },
  { label: 'Sports', value: 'sports', icon: '⚽' },
  { label: 'Superheroes', value: 'superheroes', icon: '🦸' },
  { label: 'Nature', value: 'nature', icon: '🌿' },
  { label: 'Mandala', value: 'mandala', icon: '🔮' },
  { label: 'Abstract', value: 'abstract', icon: '🎨' },
  { label: 'Minimal', value: 'minimal', icon: '◻️' },
  { label: 'Vintage', value: 'vintage', icon: '📻' },
  { label: 'Combo', value: 'combo', icon: '🎁' },
]

export default function Shop({ categoryFilter }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [priceMax, setPriceMax] = useState(5000)
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all')
  const [activeTheme, setActiveTheme] = useState('all')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const constraints = [where('isActive', '==', true), orderBy('createdAt', 'desc')]
        if (categoryFilter) constraints.splice(1, 0, where('category', '==', categoryFilter))
        const snap = await getDocs(query(collection(db, 'products'), ...constraints))
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [categoryFilter])

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
      const matchPrice = p.price <= priceMax
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchTheme = activeTheme === 'all' || p.theme === activeTheme
      return matchSearch && matchPrice && matchCat && matchTheme
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  const pageTitle = categoryFilter === 'wall-sticker'
    ? 'Wall Stickers'
    : categoryFilter === 'tshirt'
    ? 'T-Shirts'
    : 'All Products'

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="relative px-4 py-14 text-center overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-bold tracking-widest block mb-2" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>
            BROWSE
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#666' }}>{filtered.length} products</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Theme pills */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveTheme(t.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  background: activeTheme === t.value ? '#00ff88' : 'rgba(255,255,255,0.04)',
                  color: activeTheme === t.value ? '#000' : '#777',
                  border: activeTheme === t.value ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: activeTheme === t.value ? '0 0 15px rgba(0,255,136,0.3)' : 'none',
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div
          className="flex flex-col md:flex-row gap-3 mb-6 p-4 rounded-2xl"
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#555' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Price range */}
          <div className="flex items-center gap-3">
            <span className="text-xs whitespace-nowrap" style={{ color: '#666', fontFamily: 'DM Sans' }}>Max ₹{priceMax}</span>
            <input type="range" min={100} max={5000} step={100} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-28 accent-green-400" />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm"
            style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#aaa', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>

        {/* Category pills (only on /shop) */}
        {!categoryFilter && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { label: 'All', value: 'all' },
              { label: '🖼️ Stickers', value: 'wall-sticker' },
              { label: '👕 T-Shirts', value: 'tshirt' },
            ].map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  background: activeCategory === cat.value ? '#7F77DD' : 'rgba(255,255,255,0.04)',
                  color: activeCategory === cat.value ? '#fff' : '#777',
                  border: activeCategory === cat.value ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: activeCategory === cat.value ? '0 0 15px rgba(127,119,221,0.4)' : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#111', aspectRatio: '3/4' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne', color: '#555' }}>Nothing found</p>
            <p className="text-sm" style={{ color: '#444' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" layout>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
