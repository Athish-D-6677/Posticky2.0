import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

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

export default function Checkout() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { coupon, discount = 0, shipping = 49, total = cartTotal } = state || {}

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(-1) // -1 = new
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

  const getAddress = () =>
    selectedAddr >= 0 ? savedAddresses[selectedAddr] : newAddr

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
      await updateDoc(doc(db, 'coupons', coupon.id), { usedCount: increment(1) })
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

  const handleRazorpay = async () => {
    setLoading(true)
    const loaded = await loadRazorpay()
    if (!loaded) { alert('Razorpay failed to load'); setLoading(false); return }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
      amount: total * 100,
      currency: 'INR',
      name: 'Posticky',
      description: 'Order Payment',
      handler: async (response) => {
        await saveOrderToFirestore(response.razorpay_payment_id)
      },
      prefill: { name: user.displayName, email: user.email },
      theme: { color: '#7F77DD' },
      modal: { ondismiss: () => setLoading(false) },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  const handlePlaceOrder = async () => {
    const address = getAddress()
    if (!address.name || !address.line1 || !address.city || !address.pincode) {
      alert('Please fill in all address fields')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Saved addresses */}
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddr === -1}
                    onChange={() => setSelectedAddr(-1)}
                  />
                  <span className="text-sm text-primary">+ Add new address</span>
                </label>
              </div>
            </div>
          )}

          {/* New address form */}
          {selectedAddr === -1 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Full Name *" value={newAddr.name} onChange={setAddr('name')} className="input col-span-2" />
                <input placeholder="Address Line 1 *" value={newAddr.line1} onChange={setAddr('line1')} className="input col-span-2" />
                <input placeholder="City *" value={newAddr.city} onChange={setAddr('city')} className="input" />
                <input placeholder="State" value={newAddr.state} onChange={setAddr('state')} className="input" />
                <input placeholder="Pincode *" value={newAddr.pincode} onChange={setAddr('pincode')} className="input" />
                <input placeholder="Phone" value={newAddr.phone} onChange={setAddr('phone')} className="input" />
              </div>
            </div>
          )}

          {/* Payment method */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <span className="text-sm text-gray-700 dark:text-gray-300">💳 Razorpay (UPI / Card / Net Banking)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="text-sm text-gray-700 dark:text-gray-300">💵 Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 h-fit flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between">
                <span className="line-clamp-1 flex-1">{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex flex-col gap-1">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{discount}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Place Order ₹${total}`}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
