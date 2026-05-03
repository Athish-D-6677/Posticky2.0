import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'

const STATUS_COLORS = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))).then((snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.orderStatus === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Orders</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
              filter === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => window.location.href = `/admin/orders/${o.id}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{o.id.slice(0, 10)}...</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{o.items?.length}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₹{o.total}</td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {o.createdAt?.toDate?.()?.toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
