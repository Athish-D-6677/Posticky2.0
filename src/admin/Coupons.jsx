import { useEffect, useState } from 'react'
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'

const emptyForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderValue: '',
  maxUses: '',
  expiresAt: '',
  isActive: true,
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'coupons'), orderBy('code')))
    setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    await addDoc(collection(db, 'coupons'), {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      maxUses: Number(form.maxUses),
      usedCount: 0,
      isActive: form.isActive,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
      createdAt: serverTimestamp(),
    })
    setForm(emptyForm)
    setToast('Coupon added!')
    setTimeout(() => setToast(''), 2000)
    await load()
    setLoading(false)
  }

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, 'coupons', id), { isActive: !current })
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !current } : c))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    await deleteDoc(doc(db, 'coupons', id))
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Coupons</h1>

      {toast && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl text-sm">{toast}</div>
      )}

      {/* Add coupon form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Add Coupon</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Code (e.g. SAVE20)" value={form.code} onChange={set('code')} required className="input uppercase" />
          <select value={form.discountType} onChange={set('discountType')} className="input">
            <option value="percentage">Percentage %</option>
            <option value="flat">Flat ₹</option>
          </select>
          <input type="number" placeholder="Discount Value" value={form.discountValue} onChange={set('discountValue')} required className="input" />
          <input type="number" placeholder="Min Order ₹" value={form.minOrderValue} onChange={set('minOrderValue')} required className="input" />
          <input type="number" placeholder="Max Uses" value={form.maxUses} onChange={set('maxUses')} required className="input" />
          <input type="date" value={form.expiresAt} onChange={set('expiresAt')} className="input" />
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 col-span-2 md:col-span-1">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
            Active
          </label>
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 md:col-span-3 bg-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Coupon'}
          </button>
        </form>
      </div>

      {/* Coupons table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Min Order</th>
              <th className="px-4 py-3 text-left">Uses</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">{c.code}</td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{c.discountType}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">
                  {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">₹{c.minOrderValue}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.usedCount}/{c.maxUses}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                  {c.expiresAt?.toDate?.()?.toLocaleDateString('en-IN') || '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(c.id, c.isActive)}
                    className={`w-10 h-6 rounded-full transition relative ${c.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${c.isActive ? 'left-5' : 'left-1'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No coupons yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
