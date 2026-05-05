import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

const emptyAddress = { name: '', line1: '', city: '', state: '', pincode: '', phone: '' }

const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f0', fontFamily: 'DM Sans, sans-serif' }
const onFocus = e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,136,0.06)' }
const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

export default function Checkout() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { coupon, discount = 0, shipping = 49, total = cartTotal } = state || {}

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(-1)
  const [newAddr, setNewAddr] = useState(emptyAddress)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists()) setSavedAddresses(snap.data().addresses || [])
    })
  }, [user])

  const setAddr = k => e => setNewAddr({ ...newAddr, [k]: e.target.value })
  const getAddress = () => selectedAddr >= 0 ? savedAddresses[selectedAddr] : newAddr

  const saveOrder = async (paymentId = null) => {
    const address = getAddress()
    const orderData = {
      userId: user.uid,
      items: cart.map(i => ({ productId: i.productId, name: i.name, image: i.image, qty: i.qty, price: i.price, size: i.size, customText: i.customText })),
      subtotal: cartTotal, discount, couponCode: coupon?.code || '',
      shippingCost: shipping, total, address, paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'processing', trackingNumber: '', createdAt: serverTimestamp(),
    }
    if (paymentId) orderData.razorpayPaymentId = paymentId
    const ref = await addDoc(collection(db, 'orders'), orderData)
    if (coupon?.id) await updateDoc(doc(db, 'coupons', coupon.id), { usedCount: increment(1) })
    if (selectedAddr === -1 && newAddr.name) await updateDoc(doc(db, 'users', user.uid), { addresses: [...savedAddresses, newAddr] })
    clearCart()
    navigate('/order-success', { state: { orderId: ref.id } })
  }

  const handleRazorpay = async () => {
    setLoading(true)
    const loaded = await loadRazorpay()
    if (!loaded) { setError('Payment gateway failed to load.'); setLoading(false); return }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Sl45SeYFyoJ952',
      amount: total * 100, currency: 'INR',
      name: 'Posticky', description: 'Order Payment',
      handler: async response => { await saveOrder(response.razorpay_payment_id) },
      prefill: { name: user?.displayName || '', email: user?.email || '', contact: getAddress().phone || '' },
      theme: { color: '#00ff88' },
      modal: { ondismiss: () => setLoading(false) },
    }
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', r => { setError(`Payment failed: ${r.error.description}`); setLoading(false) })
    rzp.open()
  }

  const handlePlaceOrder = async () => {
    const address = getAddress()
    if (!address.name || !address.line1 || !address.city || !address.pincode) {
      setError('Please fill in all required address fields'); return
    }
    setError('')
    if (paymentMethod === 'razorpay') { handleRazorpay() }
    else { setLoading(true); await saveOrder(); setLoading(false) }
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>ALMOST THERE</span>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Checkout</h1>
        </motion.div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.25)', color: '#ff2d78', fontFamily: 'DM Sans, sans-serif' }}>{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Saved addresses */}
            {savedAddresses.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-sm font-extrabold mb-4 tracking-widest" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>SAVED ADDRESSES</h2>
                <div className="flex flex-col gap-3">
                  {savedAddresses.map((addr, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl transition-all" style={{ background: selectedAddr === i ? 'rgba(0,255,136,0.06)' : 'transparent', border: `1px solid ${selectedAddr === i ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                      <input type="radio" name="address" checked={selectedAddr === i} onChange={() => setSelectedAddr(i)} className="mt-1 accent-green-400" />
                      <div className="text-sm" style={{ color: '#aaa', fontFamily: 'DM Sans, sans-serif' }}>
                        <p className="font-bold mb-0.5" style={{ color: '#f0f0f0' }}>{addr.name}</p>
                        <p>{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p>{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer px-3 py-2">
                    <input type="radio" name="address" checked={selectedAddr === -1} onChange={() => setSelectedAddr(-1)} className="accent-green-400" />
                    <span className="text-sm font-bold" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>+ Add new address</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* New address form */}
            {selectedAddr === -1 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-sm font-extrabold mb-5 tracking-widest" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>DELIVERY ADDRESS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Full Name *" value={newAddr.name} onChange={setAddr('name')} className={`col-span-2 ${inputCls}`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input placeholder="Address Line 1 *" value={newAddr.line1} onChange={setAddr('line1')} className={`col-span-2 ${inputCls}`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input placeholder="City *" value={newAddr.city} onChange={setAddr('city')} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input placeholder="State" value={newAddr.state} onChange={setAddr('state')} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input placeholder="Pincode *" value={newAddr.pincode} onChange={setAddr('pincode')} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input placeholder="Phone" value={newAddr.phone} onChange={setAddr('phone')} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </motion.div>
            )}

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-sm font-extrabold mb-5 tracking-widest" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>PAYMENT METHOD</h2>
              <div className="flex flex-col gap-3">
                {[
                  { value: 'razorpay', label: '💳 Razorpay', sub: 'UPI / Cards / Net Banking / Wallets' },
                  { value: 'cod',      label: '💵 Cash on Delivery', sub: 'Pay when your order arrives' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-4 cursor-pointer p-4 rounded-xl transition-all"
                    style={{ background: paymentMethod === opt.value ? 'rgba(0,255,136,0.06)' : 'transparent', border: `1px solid ${paymentMethod === opt.value ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                    <input type="radio" name="payment" checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="accent-green-400" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="rounded-2xl p-6 sticky top-24" style={{ background: '#111', border: '1px solid rgba(0,255,136,0.15)' }}>
              <h2 className="text-sm font-extrabold mb-5 tracking-widest" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>ORDER SUMMARY</h2>

              <div className="flex flex-col gap-2 mb-5">
                {cart.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-xs gap-2">
                    <span className="line-clamp-1 flex-1" style={{ color: '#777', fontFamily: 'DM Sans, sans-serif' }}>{item.name} × {item.qty}</span>
                    <span style={{ color: '#aaa', fontFamily: 'Syne, sans-serif' }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 text-sm pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Subtotal</span><span style={{ color: '#ccc' }}>₹{cartTotal}</span></div>
                {discount > 0 && <div className="flex justify-between"><span style={{ color: '#00ff88', fontFamily: 'DM Sans, sans-serif' }}>Discount {coupon?.code && `(${coupon.code})`}</span><span style={{ color: '#00ff88' }}>−₹{discount}</span></div>}
                <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Shipping</span><span style={{ color: shipping === 0 ? '#00ff88' : '#ccc' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              </div>

              <div className="flex justify-between font-bold py-4 my-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>Total</span>
                <span style={{ fontFamily: 'Syne, sans-serif', color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.4)' }}>₹{total}</span>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading}
                className="btn-neon w-full py-4 text-sm"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : `Place Order · ₹${total}`}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}>🔒 Secured by Razorpay</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}