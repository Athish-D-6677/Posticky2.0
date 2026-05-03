import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const applyCoupon = async () => {
    setCouponError('')
    setCoupon(null)
    const snap = await getDocs(
      query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('isActive', '==', true))
    )
    if (snap.empty) { setCouponError('Invalid or inactive coupon'); return }
    const c = { id: snap.docs[0].id, ...snap.docs[0].data() }
    if (c.expiresAt?.toDate() < new Date()) { setCouponError('Coupon expired'); return }
    if (c.usedCount >= c.maxUses) { setCouponError('Coupon usage limit reached'); return }
    if (cartTotal < c.minOrderValue) { setCouponError(`Minimum order ₹${c.minOrderValue} required`); return }
    setCoupon(c)
  }

  const discount = coupon
    ? coupon.discountType === 'percentage'
      ? Math.round((cartTotal * coupon.discountValue) / 100)
      : coupon.discountValue
    : 0

  const shipping = cartTotal - discount >= 499 ? 0 : 49
  const total = cartTotal - discount + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">🛒</p>
        <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
        <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-full text-sm">Shop Now</Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {cart.map((item) => {
            const key = `${item.productId}-${item.size}-${item.customText}`
            return (
              <div key={key} className="flex gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                <img src={item.image || 'https://placehold.co/80x80'} alt="" className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  {item.size && <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size}</p>}
                  {item.customText && <p className="text-xs text-gray-500 dark:text-gray-400">Text: {item.customText}</p>}
                  <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(key)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <button onClick={() => updateQty(key, item.qty - 1)} className="px-2 py-1 text-gray-600 dark:text-gray-300">−</button>
                    <span className="text-sm text-gray-900 dark:text-white w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(key, item.qty + 1)} className="px-2 py-1 text-gray-600 dark:text-gray-300">+</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{item.price * item.qty}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 h-fit flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Order Summary</h2>

          {/* Coupon */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="input flex-1 text-sm"
            />
            <button onClick={applyCoupon} className="bg-primary text-white px-3 py-2 rounded-xl text-sm">Apply</button>
          </div>
          {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
          {coupon && <p className="text-green-500 text-xs">✓ Coupon applied! Saving ₹{discount}</p>}

          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{discount}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { coupon, discount, shipping, total } })}
            className="bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </motion.div>
  )
}
