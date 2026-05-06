import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [customText, setCustomText] = useState('')
  const [reviews, setReviews] = useState([])
  const [tab, setTab] = useState('description')
  const [canReview, setCanReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
    }
    const loadReviews = async () => {
      const snap = await getDocs(
        query(collection(db, 'reviews'), where('productId', '==', id), orderBy('createdAt', 'desc'))
      )
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
    loadReviews()
  }, [id])

  useEffect(() => {
    if (!user || !product) return
    const checkPurchase = async () => {
      const snap = await getDocs(
        query(collection(db, 'orders'), where('userId', '==', user.uid), where('orderStatus', '==', 'delivered'))
      )
      setCanReview(snap.docs.some(d => d.data().items?.some(item => item.productId === id)))
    }
    checkPurchase()
  }, [user, product, id])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 2000)
  }

  const handleAddToCart = () => {
    const sizes = product.variants?.sizes || []
    const stickerSizes = product.variants?.stickerSizes || []
    if ((sizes.length > 0 || stickerSizes.length > 0) && !selectedSize) {
      showToast('Please select a size', 'error')
      return
    }
    setAdding(true)
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      size: selectedSize,
      customText,
    })
    setTimeout(() => setAdding(false), 1500)
    showToast('Added to cart!')
  }

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return }
    setWishlisted(true)
    await updateDoc(doc(db, 'users', user.uid), { wishlist: arrayUnion(product.id) })
    showToast('Saved to wishlist!')
  }

  const submitReview = async () => {
    if (!reviewForm.comment.trim()) return
    setSubmitting(true)
    await addDoc(collection(db, 'reviews'), {
      productId: id,
      userId: user.uid,
      userName: user.displayName || user.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      images: [],
      createdAt: serverTimestamp(),
    })
    setReviewForm({ rating: 5, comment: '' })
    setSubmitting(false)
    showToast('Review submitted!')
  }

  if (!product) return (
    <div style={{ background: '#080808', minHeight: '100vh' }} className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '2px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88' }} />
        <span className="text-xs tracking-widest" style={{ color: '#555', fontFamily: 'Syne, sans-serif' }}>LOADING</span>
      </div>
    </div>
  )

  const allSizes = product.category === 'tshirt'
    ? product.variants?.sizes || []
    : product.variants?.stickerSizes || []

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0f0f0',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-bold"
            style={{
              background: toast.type === 'error' ? 'rgba(255,45,120,0.15)' : 'rgba(0,255,136,0.12)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(255,45,120,0.4)' : 'rgba(0,255,136,0.4)'}`,
              color: toast.type === 'error' ? '#ff2d78' : '#00ff88',
              fontFamily: 'Syne, sans-serif',
              backdropFilter: 'blur(20px)',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-6xl mx-auto px-4 py-10">

        {/* Back button + Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888', fontFamily: 'Syne, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)'; e.currentTarget.style.color = '#00ff88' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#888' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
            <button onClick={() => navigate('/shop')} style={{ color: '#555' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >Shop</button>
            <span>/</span>
            <span style={{ color: '#888' }}>{product.name}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

          {/* ── IMAGE GALLERY ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* Main image */}
            <div
              className="relative overflow-hidden rounded-3xl mb-3 cursor-zoom-in"
              style={{ aspectRatio: '1/1', background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => setLightbox(true)}
            >
              <img
                src={product.images?.[selectedImage] || 'https://placehold.co/600x600/111/333?text=POSTICKY'}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,0,0,0.6)', color: '#aaa', backdropFilter: 'blur(10px)', fontFamily: 'Syne, sans-serif' }}>
                🔍 Click to zoom
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: '#ff2d78', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
                    -{discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)', fontFamily: 'Syne, sans-serif' }}>
                    NEW
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: '#222', color: '#666', fontFamily: 'Syne, sans-serif' }}>
                    SOLD OUT
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      border: selectedImage === i ? '2px solid #00ff88' : '2px solid rgba(255,255,255,0.07)',
                      boxShadow: selectedImage === i ? '0 0 12px rgba(0,255,136,0.3)' : 'none',
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── PRODUCT INFO ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Category tag */}
            <span className="text-xs font-bold tracking-widest" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>
              {product.category?.toUpperCase() || 'PRODUCT'}
            </span>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-extrabold leading-snug" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4" fill={s <= Math.round(avgRating) ? '#f5c518' : '#2a2a2a'} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold" style={{ color: '#f5c518', fontFamily: 'Syne, sans-serif' }}>{avgRating}</span>
                <span className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg line-through" style={{ color: '#444' }}>₹{product.originalPrice}</span>
              )}
              {discount && (
                <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,45,120,0.12)', color: '#ff2d78', border: '1px solid rgba(255,45,120,0.25)', fontFamily: 'Syne, sans-serif' }}>
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock warning */}
            {product.stock > 0 && product.stock < 5 && (
              <p className="text-xs font-bold px-3 py-2 rounded-xl" style={{ color: '#ff9500', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
                ⚡ Only {product.stock} left in stock!
              </p>
            )}

            {/* Divider */}
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Size selector */}
            {allSizes.length > 0 && (
              <div>
                <p className="text-xs font-bold mb-3 tracking-widest" style={{ color: '#888', fontFamily: 'Syne, sans-serif' }}>
                  {product.category === 'tshirt' ? 'SELECT SIZE' : 'SELECT STICKER SIZE'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                      style={{
                        fontFamily: 'Syne, sans-serif',
                        background: selectedSize === s ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)',
                        border: selectedSize === s ? '1px solid rgba(0,255,136,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedSize === s ? '#00ff88' : '#888',
                        boxShadow: selectedSize === s ? '0 0 12px rgba(0,255,136,0.2)' : 'none',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom text */}
            {product.variants?.allowCustomText && (
              <div>
                <label className="text-xs font-bold mb-2 block tracking-widest" style={{ color: '#888', fontFamily: 'Syne, sans-serif' }}>
                  {(product.variants.customTextLabel || 'CUSTOM TEXT').toUpperCase()}
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  background: product.stock === 0 ? 'rgba(255,255,255,0.04)' : adding ? 'rgba(0,255,136,0.2)' : 'rgba(0,255,136,0.12)',
                  border: product.stock === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,255,136,0.4)',
                  color: product.stock === 0 ? '#444' : '#00ff88',
                  boxShadow: product.stock === 0 || adding ? 'none' : '0 0 20px rgba(0,255,136,0.15)',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => {
                  if (product.stock > 0 && !adding) e.currentTarget.style.background = 'rgba(0,255,136,0.22)'
                }}
                onMouseLeave={e => {
                  if (product.stock > 0 && !adding) e.currentTarget.style.background = 'rgba(0,255,136,0.12)'
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : adding ? '✓ Added!' : '+ Add to Cart'}
              </button>

              <button
                onClick={handleWishlist}
                className="w-13 px-4 py-3.5 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: wishlisted ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.04)',
                  border: wishlisted ? '1px solid rgba(255,45,120,0.4)' : '1px solid rgba(255,255,255,0.1)',
                }}
                onMouseEnter={e => { if (!wishlisted) e.currentTarget.style.borderColor = 'rgba(255,45,120,0.4)' }}
                onMouseLeave={e => { if (!wishlisted) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={wishlisted ? '#ff2d78' : 'none'} viewBox="0 0 24 24" stroke={wishlisted ? '#ff2d78' : '#888'} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: '⚡', text: '48hr Dispatch' },
                { icon: '🔒', text: 'Secure Pay' },
                { icon: '↩️', text: 'Easy Returns' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1 py-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── TABS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

          {/* Tab headers */}
          <div className="flex gap-1 mb-8 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
            {['description', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  background: tab === t ? 'rgba(0,255,136,0.1)' : 'transparent',
                  color: tab === t ? '#00ff88' : '#555',
                  border: tab === t ? '1px solid rgba(0,255,136,0.25)' : '1px solid transparent',
                }}
              >
                {t} {t === 'reviews' && reviews.length > 0 && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="max-w-2xl">
                  <p className="text-sm leading-relaxed" style={{ color: '#888', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.8' }}>
                    {product.description || 'No description available for this product.'}
                  </p>

                  {/* Specs if available */}
                  {(product.material || product.dimensions || product.weight) && (
                    <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      {[
                        { label: 'Material', value: product.material },
                        { label: 'Dimensions', value: product.dimensions },
                        { label: 'Weight', value: product.weight },
                      ].filter(s => s.value).map((s, i) => (
                        <div
                          key={i}
                          className="flex justify-between px-5 py-3 text-sm"
                          style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <span style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</span>
                          <span style={{ color: '#ccc', fontFamily: 'DM Sans, sans-serif' }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'reviews' && (
              <motion.div key="rev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

                {/* Rating summary */}
                {avgRating && (
                  <div
                    className="flex items-center gap-6 p-5 rounded-2xl mb-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="text-center">
                      <p className="text-5xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f5c518' }}>{avgRating}</p>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className="w-4 h-4" fill={s <= Math.round(avgRating) ? '#f5c518' : '#2a2a2a'} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{reviews.length} reviews</p>
                    </div>
                  </div>
                )}

                {/* Reviews list */}
                <div className="flex flex-col gap-4 mb-8">
                  {reviews.length === 0 ? (
                    <p className="text-sm py-8 text-center" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    reviews.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-5 rounded-2xl"
                        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
                            >
                              {(r.userName || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-bold" style={{ color: '#e0e0e0', fontFamily: 'Syne, sans-serif' }}>{r.userName || 'Customer'}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className="w-3.5 h-3.5" fill={s <= r.rating ? '#f5c518' : '#2a2a2a'} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#777', fontFamily: 'DM Sans, sans-serif' }}>{r.comment}</p>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Write review */}
                {canReview && user && (
                  <div className="p-6 rounded-2xl" style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)' }}>
                    <h3 className="font-extrabold mb-4 text-sm tracking-widest" style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88' }}>
                      WRITE A REVIEW
                    </h3>
                    {/* Stars */}
                    <div className="flex gap-2 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-2xl transition-transform"
                          style={{ transform: star <= reviewForm.rating ? 'scale(1.2)' : 'scale(1)' }}
                        >
                          <svg className="w-7 h-7" fill={star <= reviewForm.rating ? '#f5c518' : '#2a2a2a'} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none mb-4"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    />
                    <button
                      onClick={submitReview}
                      disabled={submitting}
                      className="btn-neon px-6 py-2.5 text-sm"
                      style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review →'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="w-full rounded-2xl object-contain"
                style={{ maxHeight: '80vh' }}
              />
              {/* Close */}
              <button
                onClick={() => setLightbox(false)}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Prev / Next arrows for multiple images */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}