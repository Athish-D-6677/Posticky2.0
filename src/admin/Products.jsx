import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { motion } from 'framer-motion'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, 'products', id), { isActive: !current })
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteDoc(doc(db, 'products', id))
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || p.category === category
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'stock') return a.stock - b.stock
      return 0 // newest already sorted by query
    })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          + Add New Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input sm:w-40">
          <option value="all">All Categories</option>
          <option value="wall-sticker">Wall Stickers</option>
          <option value="tshirt">T-Shirts</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-40">
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock">Stock ↑</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={p.images?.[0] || 'https://placehold.co/40x40'}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                  {p.category === 'wall-sticker' ? 'Sticker' : 'T-Shirt'}
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">₹{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p.id, p.isActive)}
                    className={`w-10 h-6 rounded-full transition relative ${p.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${p.isActive ? 'left-5' : 'left-1'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="text-primary hover:underline text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
