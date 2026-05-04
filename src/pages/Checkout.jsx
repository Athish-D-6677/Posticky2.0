import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  collection, addDoc, doc, getDoc,
  updateDoc, increment, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

// ─── Load Razorpay Script ───────────────────────────────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const emptyAddress = { name: '', line1: '', city: '', state: '', pincode: '', phone: '' }

// ─── Backend URL ────────────────────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

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

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) setSavedAddresses(snap.data().addresses || [])
    })
  }, [user])

  const setAddr = (k) => (e) => setNewAddr({ ...newAddr, [k]: e.target.value })
  const getAddress = () => selectedAddr >= 0 ? savedAddresses[selectedAddr] : newAddr

  // ─── Save Order to Firestore ──────────────────────────────────────────────
  const saveOrderToFirestore = async (paymentId = null) => {
    const address = getAddress()
    const orderData = {
      userId: user.uid,
      items: cart.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        qty: i.qty,
        price: i.price,
        size: i.size,
        customText: i.customText,
      })),
      subtotal: cartTotal,
      discount,
      couponCode: coupon?.code || '',
      shippingCost: shipping,
      total,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'processing',
      trackingNumber: '',
      whatsappSent: false,
      createdAt: serverTimestamp(),
    }

    if (paymentId) orderData.razorpayPaymentId = paymentId

    const orderRef = await addDoc(collection(db, 'orders'), orderData)

    // Increment coupon usage
    if (coupon?.id) {
      await updateDoc(doc(db, 'coupons', coupon.id), {
        usedCount: increment(1),
      })
    }

    // Save new address to user profile
    if (selectedAddr === -1 && newAddr.name) {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: [...savedAddresses, newAddr],
      })
    }

    clearCart()
    navigate('/order-success', { state: { orderId: orderRef.id } })
  }

  // ─── Razorpay Handler ─────────────────────────────────────────────────────
  const handleRazorpay = async () => {
    setLoading(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Razorpay SDK failed to load. Check your internet connection.')
      setLoading(false)
      return
    }

    try {
      // 🔥 CREATE ORDER FROM YOUR BACKEND (server.js)
      const res = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }), // ₹ amount — your backend multiplies ×100
      })

      if (!res.ok) throw new Error(`Backend error: ${res.status}`)

      const order = await res.json()
      // order = { id: 'order_xxx', amount: 49900, currency: 'INR', ... }

      const options = {
        key: 'rzp_test_Sl45SeYFyoJ952',   // from your .env
        amount: order.amount,                          // ✅ paise — from backend
        currency: order.currency || 'INR',
        name: 'Posticky',
        description: 'Order Payment',
        order_id: order.id,                            // ✅ Razorpay order ID — from backend

        handler: async (response) => {
          // Called on successful payment
          await saveOrderToFirestore(response.razorpay_payment_id)
        },

        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
          contact: getAddress().phone || '',
        },

        notes: {
          address: `${getAddress().line1}, ${getAddress().city}`,
        },

        theme: { color: '#7F77DD' },

        modal: {
          ondismiss: () => setLoading(false), // user closed the popup
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })

      rzp.open()

    } catch (err) {
      console.error('Razorpay error:', err)
      alert('Payment failed. Please try again.')
      setLoading(false) // ✅ only reset on error
    }
  }

  // ─── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    const address = getAddress()
    if (!address.name || !address.line1 || !address.city || !address.pincode) {
      alert('Please fill in all required address fields')
      return
    }

    if (paymentMethod === 'razorpay') {
      handleRazorpay()
    } else {
      setLoading(true)
      await saveOrderToFirestore()
      setLoading(false)
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Left Column ── */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Saved Addresses</h2>
              <div className="flex flex-col gap-2">
                {savedAddresses.map((addr, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddr === i}
                      onChange={() => setSelectedAddr(i)}
                      className="mt-1"
                    />
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium">{addr.name}</p>
                      <p>{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p>{addr.phone}</p>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer mt-1">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddr === -1}
                    onChange={() => setSelectedAddr(-1)}
                  />
                  <span className="text-sm text-purple-500 font-medium">+ Add new address</span>
                </label>
              </div>
            </div>
          )}

          {/* New Address Form */}
          {selectedAddr === -1 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Full Name *"
                  value={newAddr.name}
                  onChange={setAddr('name')}
                  className="col-span-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <input
                  placeholder="Address Line 1 *"
                  value={newAddr.line1}
                  onChange={setAddr('line1')}
                  className="col-span-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <input
                  placeholder="City *"
                  value={newAddr.city}
                  onChange={setAddr('city')}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <input
                  placeholder="State"
                  value={newAddr.state}
                  onChange={setAddr('state')}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <input
                  placeholder="Pincode *"
                  value={newAddr.pincode}
                  onChange={setAddr('pincode')}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <input
                  placeholder="Phone"
                  value={newAddr.phone}
                  onChange={setAddr('phone')}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">💳 Razorpay (UPI / Card / Net Banking)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">💵 Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Column: Order Summary ── */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 h-fit flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Order Summary</h2>

          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between">
                <span className="line-clamp-1 flex-1 pr-2">{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-1 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Subtotal</span><span>₹{cartTotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount {coupon?.code && `(${coupon.code})`}</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base mt-1">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Place Order ₹${total}`}
          </button>
        </div>

      </div>
    </motion.div>
  )
}