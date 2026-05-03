import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Unauthorized() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <div className="text-6xl">🚫</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Unauthorized</h1>
      <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
      <Link to="/" className="bg-primary text-white px-6 py-2 rounded-full text-sm mt-2">Go Home</Link>
    </motion.div>
  )
}
