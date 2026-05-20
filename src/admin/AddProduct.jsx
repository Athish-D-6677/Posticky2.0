import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../firebase'
import axios from 'axios'
import { motion } from 'framer-motion'

const TSHIRT_SIZES = ['Oversize']
const STICKER_SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

const STICKER_THEMES = [
  'Movie', 'Series', 'Music', 'Car', 'Bike', 'Gaming', 'Anime',
  'Quotes', 'Gym', 'Sports', 'Superheroes', 'Nature', 'Mandala',
  'Abstract', 'Minimal', 'Vintage', 'Combo',
]

const TSHIRT_THEMES = [
  { label: 'Tech/Programmer Streetwear', value: 'tech-programmer' },
  { label: 'Tamil Culture Streetwear', value: 'tamil-culture' },
  { label: 'Anime Streetwear', value: 'anime-streetwear' },
  { label: 'Meme', value: 'meme' },
  { label: 'Aesthetic', value: 'aesthetic' },
  { label: 'Dark Cyberpunk', value: 'dark-cyberpunk' },
]

const defaultForm = {
  name: '',
  category: 'wall-sticker',
  theme: '',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  tags: '',
  isActive: true,
  variants: {
    sizes: [],
    stickerSizes: [],
    allowCustomText: false,
    customTextLabel: '',
  },
}

export default function AddProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState(defaultForm)
  const [existingImages, setExistingImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (isEdit) {
      getDoc(doc(db, 'products', id)).then((snap) => {
        if (snap.exists()) {
          const d = snap.data()

          setForm({
            name: d.name || '',
            category: d.category || 'wall-sticker',
            price: d.price || '',
            originalPrice: d.originalPrice || '',
            stock: d.stock || '',
            description: d.description || '',
            tags: d.tags?.join(', ') || '',
            theme: d.theme || '',
            isActive: d.isActive ?? true,
            variants: d.variants || defaultForm.variants,
          })

          setExistingImages(d.images || [])
        }
      })
    }
  }, [id, isEdit])

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    })

  const setVariant = (k, v) =>
    setForm({
      ...form,
      variants: {
        ...form.variants,
        [k]: v,
      },
    })

  const toggleSize = (arr, val) =>
    arr.includes(val)
      ? arr.filter((s) => s !== val)
      : [...arr, val]

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      5 - existingImages.length
    )

    setNewFiles(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  // ✅ CLOUDINARY UPLOAD
  const uploadToCloudinary = async (file) => {
    const formData = new FormData()

    formData.append('file', file)

    formData.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    )

    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    )

    return response.data.secure_url
  }

  // ✅ REMOVE IMAGE
  const removeExisting = async (url) => {
    setExistingImages((prev) =>
      prev.filter((u) => u !== url)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const docRef = isEdit
        ? doc(db, 'products', id)
        : doc(collection(db, 'products'))

      // ✅ Upload Images To Cloudinary
      const uploadedUrls = await Promise.all(
        newFiles.map(async (file) => {
          return await uploadToCloudinary(file)
        })
      )

      const data = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : null,
        stock: Number(form.stock),
        description: form.description,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        theme: form.theme,
        isActive: form.isActive,
        variants: form.variants,
        images: [...existingImages, ...uploadedUrls],
      }

      if (isEdit) {
        await updateDoc(docRef, data)
      } else {
        await setDoc(docRef, {
          ...data,
          createdAt: serverTimestamp(),
        })
      }

      setToast(
        isEdit
          ? 'Product updated!'
          : 'Product added!'
      )

      setTimeout(() => {
        navigate('/admin/products')
      }, 1200)

    } catch (err) {
      console.error(err)
      setToast('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      {toast && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl text-sm">
          {toast}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Basic Info
          </h2>

          <input
            type="text"
            placeholder="Product Name *"
            value={form.name}
            onChange={set('name')}
            required
            className="input"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={set('category')}
              className="input"
            >
              <option value="wall-sticker">
                Wall Sticker
              </option>

              <option value="tshirt">
                T-Shirt
              </option>
            </select>

            <select
              value={form.theme}
              onChange={set('theme')}
              className="input"
            >
              <option value="">Select Theme</option>
              {(form.category === 'tshirt' ? TSHIRT_THEMES : STICKER_THEMES.map(t => ({ label: t, value: t.toLowerCase() }))).map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Price ₹ *"
              value={form.price}
              onChange={set('price')}
              required
              className="input"
            />

            <input
              type="number"
              placeholder="MRP ₹"
              value={form.originalPrice}
              onChange={set('originalPrice')}
              className="input"
            />

            <input
              type="number"
              placeholder="Stock *"
              value={form.stock}
              onChange={set('stock')}
              required
              className="input"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="input resize-none"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={set('tags')}
            className="input"
          />
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Images
          </h2>

          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeExisting(url)
                    }
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg opacity-70"
                />
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="text-sm text-gray-600 dark:text-gray-400"
          />

          <p className="text-xs text-gray-400">
            Max 5 images total
          </p>
        </div>

        {/* Active Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() =>
              setForm({
                ...form,
                isActive: !form.isActive,
              })
            }
            className={`w-10 h-6 rounded-full transition ${
              form.isActive
                ? 'bg-primary'
                : 'bg-gray-300 dark:bg-gray-600'
            } relative`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                form.isActive
                  ? 'left-5'
                  : 'left-1'
              }`}
            />
          </div>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Active (visible on site)
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : isEdit
            ? 'Update Product'
            : 'Add Product'}
        </button>
      </form>
    </motion.div>
  )
}