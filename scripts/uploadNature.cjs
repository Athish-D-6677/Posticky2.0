// Run: node scripts/uploadNature.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T230629Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const NATURE_NAMES = [
  'Forest Trail Wall Sticker',
  'Mountain Peak Wall Sticker',
  'Tropical Leaves Wall Sticker',
  'Desert Dunes Wall Sticker',
  'Ocean Waves Wall Sticker',
  'Cherry Blossom Wall Sticker',
  'Misty Valley Wall Sticker',
  'Golden Meadow Wall Sticker',
  'Rainforest Wall Sticker',
  'Coral Reef Wall Sticker',
  'Wild Savanna Wall Sticker',
  'Birds In Flight Wall Sticker',
  'Koi Fish Wall Sticker',
  'Wildflower Wall Sticker',
  'Tropical Hawaii Wall Sticker',
  'Cozy Cottage Wall Sticker',
  'Jungle Canopy Wall Sticker',
  'Lily Pond Wall Sticker',
  'Pebble Shore Wall Sticker',
  'Zen Stones Wall Sticker',
  'Golden Sunrise Wall Sticker',
  'Waterfall Serenity Wall Sticker',
  'Autumn Leaves Wall Sticker',
  'Snowy Peaks Wall Sticker',
  'Starry Night Nature Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadNature() {
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
    const name = NATURE_NAMES[i] || `Nature Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/nature',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'nature',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality nature wall sticker bringing the outdoors inside. Easy peel and stick. Waterproof and long lasting.',
        tags: ['nature', 'landscape', 'wall sticker', 'botanical', 'outdoor'],
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

  console.log('\n🎉 All done! Nature stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadNature().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
