import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const STATUS_COLORS = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getDocs(
      query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    ).then((snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user])

  const downloadInvoice = async (order) => {
    const el = document.getElementById(`invoice-${order.id}`)
    if (!el) return
    const canvas = await html2canvas(el)
    const pdf = new jsPDF()
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0)
    pdf.save(`invoice-${order.id}.pdf`)
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-400 text-center py-20">No orders yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <div
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div>
                <p className="text-xs text-gray-400 font-mono">{order.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.createdAt?.toDate?.()?.toLocaleDateString('en-IN')} · {order.items?.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 dark:text-white">₹{order.total}</span>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {order.orderStatus}
                </span>
                <span className="text-gray-400">{expanded === order.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4" id={`invoice-${order.id}`}>
                <div className="flex flex-col gap-3 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img src={item.image || 'https://placehold.co/50x50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {item.size && `Size: ${item.size} · `}Qty: {item.qty}
                          {item.customText && ` · "${item.customText}"`}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Delivery Address</p>
                  <p>{order.address?.name}, {order.address?.line1}</p>
                  <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                </div>

                {order.trackingNumber && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                    📦 Tracking: <span className="font-mono">{order.trackingNumber}</span>
                  </p>
                )}

                <button
                  onClick={() => downloadInvoice(order)}
                  className="text-sm text-primary hover:underline"
                >
                  📄 Download Invoice
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
