import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, todayOrders: 0, products: 0, users: 0 })
  const [salesData, setSalesData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'users')),
      ])

      const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const today = new Date().toDateString()

      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)
      const todayOrders = orders.filter((o) => o.createdAt?.toDate?.()?.toDateString() === today).length

      setStats({
        revenue,
        todayOrders,
        products: productsSnap.size,
        users: usersSnap.size,
      })

      setRecentOrders(orders.slice(0, 5))

      // Sales by day (last 30 days)
      const dayMap = {}
      const now = Date.now()
      orders.forEach((o) => {
        const d = o.createdAt?.toDate?.()
        if (!d) return
        if (now - d.getTime() > 30 * 24 * 60 * 60 * 1000) return
        const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        dayMap[key] = (dayMap[key] || 0) + (o.total || 0)
      })
      setSalesData(Object.entries(dayMap).map(([date, revenue]) => ({ date, revenue })))

      // Orders by category
      const catMap = { 'Wall Stickers': 0, 'T-Shirts': 0 }
      orders.forEach((o) => {
        o.items?.forEach((item) => {
          // We'd need category in order items for accuracy; approximate here
        })
      })
      // Fetch from products for category count
      const prods = productsSnap.docs.map((d) => d.data())
      setCategoryData([
        { name: 'Wall Stickers', count: prods.filter((p) => p.category === 'wall-sticker').length },
        { name: 'T-Shirts', count: prods.filter((p) => p.category === 'tshirt').length },
      ])
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰' },
    { label: "Today's Orders", value: stats.todayOrders, icon: '📦' },
    { label: 'Total Products', value: stats.products, icon: '🏷️' },
    { label: 'Total Users', value: stats.users, icon: '👥' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#7F77DD" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#7F77DD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentOrders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{o.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₹{o.total}</td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 capitalize">
                    {o.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
