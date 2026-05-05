import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const applyCoupon = async () => {
    setCouponError(''); setCoupon(null); setCouponLoading(true)
    const snap = await getDocs(query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('isActive', '==', true)))
    setCouponLoading(false)
    if (snap.empty) { setCouponError('Invalid or inactive coupon'); return }
    const c = { id: snap.docs[0].id, ...snap.docs[0].data() }
    if (c.expiresAt?.toDate() < new Date()) { setCouponError('This coupon has expired'); return }
    if (c.usedCount >= c.maxUses) { setCouponError('Coupon usage limit reached'); return }
    if (cartTotal < c.minOrderValue) { setCouponError(`Minimum order ₹${c.minOrderValue} required`); return }
    setCoupon(c)
  }

  const discount = coupon ? (coupon.discountType === 'percentage' ? Math.round((cartTotal * coupon.discountValue) / 100) : coupon.discountValue) : 0
  const shipping = cartTotal - discount >= 499 ? 0 : 49
  const total = cartTotal - discount + shipping

  if (cart.length === 0) {
    return (
      <div style={{ background: '#080808', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#00ff88" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Time to fill it with some fire pieces.</p>
          <Link to="/shop" className="btn-neon px-8 py-3.5 text-sm">Browse Shop →</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>{cart.length} ITEM{cart.length !== 1 ? 'S' : ''}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Your Cart</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <AnimatePresence>
              {cart.map((item, i) => {
                const key = `${item.productId}-${item.size}-${item.customText}`
                return (
                  <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-4 rounded-2xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Link to={`/product/${item.productId}`} className="shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: '#1a1a1a' }}>
                        <img src={item.image || 'https://placehold.co/80x80/111/333?text=P'} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug mb-1 line-clamp-2" style={{ color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>{item.name}</p>
                      {item.size && <span className="text-xs px-2 py-0.5 rounded-full inline-block mb-1" style={{ background: 'rgba(255,255,255,0.06)', color: '#888' }}>Size: {item.size}</span>}
                      {item.customText && <p className="text-xs mb-1" style={{ color: '#666' }}>"{item.customText}"</p>}
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                          <button onClick={() => updateQty(key, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: '#888' }} onMouseEnter={e => e.currentTarget.style.color = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>−</button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>{item.qty}</span>
                          <button onClick={() => updateQty(key, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-sm" style={{ color: '#888' }} onMouseEnter={e => e.currentTarget.style.color = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>+</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>₹{item.price * item.qty}</span>
                          <button onClick={() => removeFromCart(key)} className="text-xs px-2 py-1 rounded-lg transition-all" style={{ color: '#555' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ff2d78'; e.currentTarget.style.background = 'rgba(255,45,120,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent' }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <Link to="/shop" className="text-sm mt-2 inline-flex items-center gap-2 transition-colors" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'} onMouseLeave={e => e.currentTarget.style.color = '#555'}>← Continue Shopping</Link>
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-2xl p-6 sticky top-24" style={{ background: '#111', border: '1px solid rgba(0,255,136,0.15)' }}>
              <h3 className="text-lg font-extrabold mb-5" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Order Summary</h3>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-xs font-bold mb-2 block tracking-widest" style={{ color: '#666', fontFamily: 'Syne, sans-serif' }}>COUPON CODE</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter code" value={couponCode}
                    onChange={e => setCouponCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f0', fontFamily: 'DM Sans, sans-serif' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <button onClick={applyCoupon} disabled={couponLoading}
                    className="px-4 rounded-xl text-xs font-bold transition-all"
                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.1)'}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs mt-1.5" style={{ color: '#ff2d78', fontFamily: 'DM Sans, sans-serif' }}>{couponError}</p>}
                {coupon && <p className="text-xs mt-1.5 font-medium" style={{ color: '#00ff88', fontFamily: 'DM Sans, sans-serif' }}>✓ Saving ₹{discount}!</p>}
              </div>

              <div className="flex flex-col gap-2.5 mb-5 text-sm">
                <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Subtotal</span><span style={{ color: '#e0e0e0', fontFamily: 'Syne, sans-serif' }}>₹{cartTotal}</span></div>
                {discount > 0 && <div className="flex justify-between"><span style={{ color: '#00ff88', fontFamily: 'DM Sans, sans-serif' }}>Discount {coupon?.code && `(${coupon.code})`}</span><span style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>−₹{discount}</span></div>}
                <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Shipping</span><span style={{ color: shipping === 0 ? '#00ff88' : '#e0e0e0', fontFamily: 'Syne, sans-serif' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                {shipping > 0 && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(0,255,136,0.06)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.12)', fontFamily: 'DM Sans, sans-serif' }}>Add ₹{499 - (cartTotal - discount)} more for free shipping!</p>}
              </div>

              <div className="flex justify-between font-bold py-4 mb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Total</span>
                <span style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.4)' }}>₹{total}</span>
              </div>

              <button onClick={() => navigate('/checkout', { state: { coupon, discount, shipping, total } })} className="btn-neon w-full py-3.5 text-sm">Proceed to Checkout →</button>
              <div className="flex items-center justify-center gap-4 mt-4">{['UPI', 'Cards', 'COD'].map(m => <span key={m} className="text-xs" style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}>{m}</span>)}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}