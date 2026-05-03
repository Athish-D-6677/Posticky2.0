import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled']

const sendWhatsAppNotification = (phone, orderData) => {
  const message = `Hi ${orderData.customerName}! Your order #${orderData.orderId} has been shipped. Tracking: ${orderData.trackingNumber}. Thank you for shopping with Posticky!`
  window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank')
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [tracking, setTracking] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    getDoc(doc(db, 'orders', id)).then((snap) => {
      if (snap.exists()) {
        const d = { id: snap.id, ...snap.data() }
        setOrder(d)
        setStatus(d.orderStatus)
        setTracking(d.trackingNumber || '')
      }
    })
  }, [id])

  const handleUpdate = async () => {
    setSaving(true)
    const updates = { orderStatus: status }
    if (status === 'shipped') updates.trackingNumber = tracking
    await updateDoc(doc(db, 'orders', id), updates)
    setOrder((prev) => ({ ...prev, ...updates }))

    if (status === 'shipped' && tracking && !order.whatsappSent) {
      sendWhatsAppNotification(order.address?.phone, {
        customerName: order.address?.name,
        orderId: id,
        trackingNumber: tracking,
      })
      await updateDoc(doc(db, 'orders', id), { whatsappSent: true })
    }

    setToast('Order updated!')
    setTimeout(() => setToast(''), 2000)
    setSaving(false)
  }

  const downloadInvoice = async () => {
    const el = document.getElementById('order-invoice')
    if (!el) return
    const canvas = await html2canvas(el)
    const pdf = new jsPDF()
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0)
    pdf.save(`invoice-${id}.pdf`)
  }

  if (!order) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Detail</h1>
      <p className="text-xs font-mono text-gray-400 mb-6">{id}</p>

      {toast && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl text-sm">{toast}</div>
      )}

      <div id="order-invoice" className="flex flex-col gap-5">
        {/* Customer & Address */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Customer</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">{order.address?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.address?.line1}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.address?.phone}</p>
        </div>

        {/* Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h2>
          <div className="flex flex-col gap-3">
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
          <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-3 flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({order.couponCode})</span><span>−₹{order.discount}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingCost}</span></div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white"><span>Total</span><span>₹{order.total}</span></div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-sm text-gray-700 dark:text-gray-300">
          <p>Payment: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
          <p>Payment Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></p>
        </div>
      </div>

      {/* Status update */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mt-5 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Update Status</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        {status === 'shipped' && (
          <input
            type="text"
            placeholder="Tracking Number"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="input"
          />
        )}
        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Order'}
          </button>
          <button
            onClick={downloadInvoice}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-xl text-sm hover:border-primary transition"
          >
            📄 Download Invoice
          </button>
        </div>
      </div>
    </motion.div>
  )
}
