import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [orderCounts, setOrderCounts] = useState({})

  useEffect(() => {
    const load = async () => {
      const [usersSnap, ordersSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'orders')),
      ])
      const counts = {}
      ordersSnap.docs.forEach((d) => {
        const uid = d.data().userId
        counts[uid] = (counts[uid] || 0) + 1
      })
      setOrderCounts(counts)
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-4 max-w-sm"
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {u.createdAt?.toDate?.()?.toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  {orderCounts[u.id] || 0}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
