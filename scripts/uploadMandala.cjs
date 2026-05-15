// Run: node scripts/uploadMandala.cjs
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const serviceAccount = require('./serviceAccountKey.json')

cloudinary.config({
  cloud_name: 'dvbzqythk',
  api_key: '347261755443642',
  api_secret: '0gFexqcAFV_fgWHO1F5WTIfHgPE',
})

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T223856Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MANDALA_NAMES = [
  'Sacred Mandala Wall Sticker',
  'Lotus Mandala Wall Sticker',
  'Boho Mandala Wall Sticker',
  'Zen Circle Mandala Wall Sticker',
  'Floral Mandala Wall Sticker',
  'Geometric Mandala Wall Sticker',
  'Sun Mandala Wall Sticker',
  'Moon Mandala Wall Sticker',
  'Celestial Mandala Wall Sticker',
  'Tribal Mandala Wall Sticker',
  'Intricate Mandala Wall Sticker',
  'Peacock Mandala Wall Sticker',
  'Elephant Mandala Wall Sticker',
  'Buddha Mandala Wall Sticker',
  'Spiritual Mandala Wall Sticker',
  'Dreamcatcher Mandala Wall Sticker',
  'Henna Mandala Wall Sticker',
  'Symmetry Mandala Wall Sticker',
  'Radiant Mandala Wall Sticker',
  'Cosmos Mandala Wall Sticker',
  'Energy Mandala Wall Sticker',
  'Chakra Mandala Wall Sticker',
  'Infinity Mandala Wall Sticker',
  'Harmony Mandala Wall Sticker',
  'Balance Mandala Wall Sticker',
  'Mystic Mandala Wall Sticker',
  'Divine Mandala Wall Sticker',
  'Ornate Mandala Wall Sticker',
  'Vintage Mandala Wall Sticker',
  'Bohemian Mandala Wall Sticker',
  'Kaleidoscope Mandala Wall Sticker',
  'Tranquil Mandala Wall Sticker',
  'Spiral Mandala Wall Sticker',
  'Petal Mandala Wall Sticker',
  'Star Mandala Wall Sticker',
  'Ocean Mandala Wall Sticker',
  'Forest Mandala Wall Sticker',
  'Fire Mandala Wall Sticker',
  'Crystal Mandala Wall Sticker',
  'Golden Mandala Wall Sticker',
  'Eternal Mandala Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadMandala() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    VALID_EXTS.includes(path.extname(f).toLowerCase())
  )

  if (!files.length) {
    console.log('No images found in folder.')
    return
  }

  console.log(`Found ${files.length} images. Uploading to Cloudinary + saving to Firestore...\n`)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(IMAGES_DIR, file)
    const name = MANDALA_NAMES[i] || `Mandala Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/mandala',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'mandala',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality mandala wall sticker with intricate spiritual art. Easy peel and stick. Waterproof and long lasting.',
        tags: ['mandala', 'spiritual', 'wall sticker', 'boho', 'zen'],
        images: [imageUrl],
        variants: {
          stickerSizes: SIZES,
          allowCustomText: false,
        },
        isActive: true,
        couponIds: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      console.log(`✅ ${file} => ${imageUrl}`)
    } catch (err) {
      console.error(`❌ Failed: ${file} — ${err.message}`)
    }
  }

  console.log('\n🎉 All done! Mandala stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadMandala().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
