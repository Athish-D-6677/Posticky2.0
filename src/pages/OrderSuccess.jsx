import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import ReactConfetti from 'react-confetti'
import { motion } from 'framer-motion'

export default function OrderSuccess() {
  const { state } = useLocation()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => { clearTimeout(timer); window.removeEventListener('resize', handleResize) }
  }, [])

  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      {showConfetti && <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} />}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thank you for your order. We'll start processing it right away.
        </p>
        {state?.orderId && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Order ID: <span className="font-mono font-medium text-gray-900 dark:text-white">{state.orderId}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Estimated delivery: <span className="font-medium text-gray-900 dark:text-white">{estimatedDelivery}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-orders" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            View My Orders
          </Link>
          <Link to="/shop" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-primary transition">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
