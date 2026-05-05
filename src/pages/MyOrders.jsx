import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const STATUS_STEPS = ['processing', 'shipped', 'delivered']

const STATUS_STYLE = {
  processing: { color: '#ff9500', bg: 'rgba(255,149,0,0.1)', border: 'rgba(255,149,0,0.25)', icon: '🔄' },
  shipped:    { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.25)', icon: '🚚' },
  delivered:  { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.25)', icon: '✅' },
  cancelled:  { color: '#ff2d78', bg: 'rgba(255,45,120,0.1)', border: 'rgba(255,45,120,0.25)', icon: '❌' },
}

function TrackingBar({ status }) {
  if (status === 'cancelled') {
    return <p className="text-sm font-medium py-2" style={{ color: '#ff2d78', fontFamily: 'DM Sans, sans-serif' }}>❌ Order Cancelled</p>
  }
  const currentStep = STATUS_STEPS.indexOf(status)
  const steps = [
    { key: 'processing', label: 'Order Placed', icon: '📦' },
    { key: 'shipped',    label: 'Shipped',      icon: '🚚' },
    { key: 'delivered',  label: 'Delivered',    icon: '✅' },
  ]
  const pct = currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%'

  return (
    <div className="py-4">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: pct, background: 'linear-gradient(90deg,#00ff88,#00d4ff)' }} />
        </div>
        {steps.map((step, i) => {
          const done = i <= currentStep
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-300"
                style={{ background: done ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)', border: `2px solid ${done ? '#00ff88' : 'rgba(255,255,255,0.1)'}`, boxShadow: done ? '0 0 12px rgba(0,255,136,0.3)' : 'none' }}>
                {step.icon}
              </div>
              <span className="text-xs font-bold" style={{ color: done ? '#00ff88' : '#444', fontFamily: 'Syne, sans-serif' }}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TABS = ['all', 'processing', 'shipped', 'delivered', 'cancelled']

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!user) return
    getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid))).then(snap => {
      const sorted = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
      setOrders(sorted)
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

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.orderStatus === activeTab)

  if (loading) return (
    <div style={{ background: '#080808', minHeight: '100vh' }} className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88' }} />
    </div>
  )

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative max-w-3xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-xs font-bold tracking-widest block mb-1" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>ORDER HISTORY</span>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f0' }}>My Orders</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all duration-200"
              style={{
                fontFamily: 'Syne, sans-serif',
                background: activeTab === tab ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                border: activeTab === tab ? '1px solid rgba(0,255,136,0.35)' : '1px solid rgba(255,255,255,0.07)',
                color: activeTab === tab ? '#00ff88' : '#666',
              }}>
              {tab} {tab !== 'all' && `(${orders.filter(o => o.orderStatus === tab).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#00ff88" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>No orders found.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {filtered.map((order, idx) => {
            const s = STATUS_STYLE[order.orderStatus] || STATUS_STYLE.processing
            const isOpen = expanded === order.id
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>

                {/* Header */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all duration-200"
                  style={{ borderBottom: isOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent' }}
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>{s.icon}</div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#888', fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>#{order.id.slice(0, 10).toUpperCase()}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                        {order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>₹{order.total}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold capitalize" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: 'Syne, sans-serif' }}>{order.orderStatus}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200" style={{ color: '#444', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="p-5" id={`invoice-${order.id}`}>

                        {/* Tracking */}
                        <div className="mb-5">
                          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>ORDER TRACKING</p>
                          <TrackingBar status={order.orderStatus} />
                        </div>

                        {/* Tracking number */}
                        {order.trackingNumber && (
                          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <span className="text-lg">🚚</span>
                            <div>
                              <p className="text-xs" style={{ color: '#00d4ff', fontFamily: 'DM Sans, sans-serif' }}>Tracking Number</p>
                              <p className="font-bold text-sm font-mono" style={{ color: '#f0f0f0' }}>{order.trackingNumber}</p>
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <div className="flex flex-col gap-3 mb-5">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <img src={item.image || 'https://placehold.co/50x50/111/333'} alt="" className="w-14 h-14 rounded-xl object-cover" />
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>{item.name}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                                  {item.size && `Size: ${item.size} · `}Qty: {item.qty}{item.customText && ` · "${item.customText}"`}
                                </p>
                              </div>
                              <p className="text-sm font-bold" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>₹{item.price * item.qty}</p>
                            </div>
                          ))}
                        </div>

                        {/* Price breakdown */}
                        <div className="rounded-xl p-4 mb-5 text-sm flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Subtotal</span><span style={{ color: '#ccc' }}>₹{order.subtotal}</span></div>
                          {order.discount > 0 && <div className="flex justify-between"><span style={{ color: '#00ff88', fontFamily: 'DM Sans, sans-serif' }}>Discount {order.couponCode && `(${order.couponCode})`}</span><span style={{ color: '#00ff88' }}>−₹{order.discount}</span></div>}
                          <div className="flex justify-between"><span style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>Shipping</span><span style={{ color: '#ccc' }}>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span></div>
                          <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="font-bold" style={{ color: '#f0f0f0', fontFamily: 'Syne, sans-serif' }}>Total</span>
                            <span className="font-bold" style={{ color: '#00ff88', fontFamily: 'Syne, sans-serif' }}>₹{order.total}</span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="mb-5">
                          <p className="text-xs font-bold tracking-widest mb-2" style={{ color: '#888', fontFamily: 'Syne, sans-serif' }}>DELIVERY ADDRESS</p>
                          <p className="text-sm" style={{ color: '#888', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 }}>
                            {order.address?.name}<br />
                            {order.address?.line1}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}<br />
                            {order.address?.phone}
                          </p>
                        </div>

                        {/* Payment */}
                        <div className="flex items-center gap-2 mb-5">
                          <span className="text-xs capitalize" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>💳 {order.paymentMethod}</span>
                          <span style={{ color: '#333' }}>·</span>
                          <span className="text-xs font-bold" style={{ color: order.paymentStatus === 'paid' ? '#00ff88' : '#ff9500', fontFamily: 'Syne, sans-serif' }}>
                            {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                          <button onClick={() => downloadInvoice(order)}
                            className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl transition-all"
                            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontFamily: 'Syne, sans-serif' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,136,0.08)'}>
                            📄 Download Invoice
                          </button>
                          {order.orderStatus === 'shipped' && order.trackingNumber && (
                            <a href={`https://www.google.com/search?q=track+parcel+${order.trackingNumber}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl transition-all"
                              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', fontFamily: 'Syne, sans-serif' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.15)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}>
                              🔍 Track Shipment
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}