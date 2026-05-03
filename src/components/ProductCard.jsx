import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { db } from '../firebase'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const toggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) return
    setWishlisted(true)
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, { wishlist: arrayUnion(product.id) })
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (
      (!product.variants?.sizes?.length) &&
      (!product.variants?.stickerSizes?.length) &&
      !product.variants?.allowCustomText
    ) {
      addToCart({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        size: '',
        customText: '',
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(0,255,136,0.25)'
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,136,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/111/333?text=POSTICKY'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}
        >
          <button
            onClick={handleQuickAdd}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
            style={{
              background: added ? '#00ff88' : 'rgba(0,255,136,0.15)',
              border: '1px solid #00ff88',
              color: added ? '#000' : '#00ff88',
              fontFamily: 'Syne, sans-serif',
              backdropFilter: 'blur(10px)',
            }}
          >
            {added ? '✓ Added' : '+ Quick Add'}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: '#ff2d78', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '10px' }}
            >
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#333', color: '#888', fontSize: '10px' }}>
              SOLD OUT
            </span>
          )}
          {product.isNew && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)', fontSize: '10px' }}>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist */}
        {user && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: wishlisted ? 'rgba(255,45,120,0.2)' : 'rgba(0,0,0,0.6)',
              border: `1px solid ${wishlisted ? 'rgba(255,45,120,0.5)' : 'rgba(255,255,255,0.1)'}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={wishlisted ? '#ff2d78' : 'none'} viewBox="0 0 24 24" stroke={wishlisted ? '#ff2d78' : '#aaa'}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p
          className="text-sm font-medium line-clamp-2 leading-snug"
          style={{ color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}
        >
          {product.name}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-sm" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: '#555' }}>₹{product.originalPrice}</span>
          )}
        </div>

        {product.stock > 0 && product.stock < 5 && (
          <p className="text-xs" style={{ color: '#ff9500' }}>Only {product.stock} left</p>
        )}

        {/* Rating stars if available */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className="w-3 h-3" fill={s <= Math.round(product.rating) ? '#f5c518' : '#333'} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-xs" style={{ color: '#666' }}>({product.reviewCount || 0})</span>
          </div>
        )}
      </div>
    </Link>
  )
}