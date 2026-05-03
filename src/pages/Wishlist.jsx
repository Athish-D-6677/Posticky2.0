import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Wishlist() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) return
      setLoading(true)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const wishlistIds = userDoc.data()?.wishlist || []
        if (wishlistIds.length === 0) { setProducts([]); setLoading(false); return }

        // Firestore 'in' query supports up to 30 items
        const chunks = []
        for (let i = 0; i < wishlistIds.length; i += 30) chunks.push(wishlistIds.slice(i, i + 30))
        const results = []
        for (const chunk of chunks) {
          const snap = await getDocs(query(collection(db, 'products'), where('__name__', 'in', chunk)))
          snap.docs.forEach(d => results.push({ id: d.id, ...d.data() }))
        }
        setProducts(results)
      } catch (e) {
        console.log('Wishlist error:', e)
      }
      setLoading(false)
    }
    loadWishlist()
  }, [user])

  const removeFromWishlist = async (productId) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), { wishlist: arrayRemove(productId) })
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (e) {
      console.log(e)
    }
  }

  const handleMoveToCart = (product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      size: '',
      customText: '',
    })
    removeFromWishlist(product.id)
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,45,120,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#ff2d78' }} />

      <div className="relative max-w-6xl mx-auto px-4 py-12">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#ff2d78', fontFamily: 'Syne, sans-serif' }}>
            SAVED ITEMS
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
            Wishlist
          </h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#111', aspectRatio: '1/1.3' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#ff2d78" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Nothing saved yet</h2>
            <p className="text-sm mb-8" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Hit the heart icon on any product to save it here.</p>
            <Link to="/shop" className="btn-neon px-8 py-3.5 text-sm">Explore Shop →</Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, i) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = '1px solid rgba(255,45,120,0.3)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(255,45,120,0.07)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img
                        src={product.images?.[0] || 'https://placehold.co/400x400/111/333?text=POSTICKY'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {discount && (
                        <span
                          className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: '#ff2d78', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '10px' }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <p className="text-sm font-medium line-clamp-2 leading-snug"
                        style={{ color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-sm" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs line-through" style={{ color: '#555' }}>₹{product.originalPrice}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                          style={{
                            background: 'rgba(0,255,136,0.1)',
                            border: '1px solid rgba(0,255,136,0.25)',
                            color: '#00ff88',
                            fontFamily: 'Syne, sans-serif',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.2)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.1)' }}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.2)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.08)' }}
                          title="Remove from wishlist"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="#ff2d78" viewBox="0 0 24 24" stroke="#ff2d78">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}