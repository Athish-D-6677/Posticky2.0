// Run: node scripts/uploadBikes.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T220808Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const BIKE_NAMES = [
  'Ride Or Die Wall Sticker',
  'Born To Ride Wall Sticker',
  'Throttle Life Wall Sticker',
  'Two Wheels One Soul Wall Sticker',
  'Biker For Life Wall Sticker',
  'Full Throttle Wall Sticker',
  'Highway King Wall Sticker',
  'Superbike Speed Wall Sticker',
  'Cafe Racer Wall Sticker',
  'Scrambler Vibes Wall Sticker',
  'Moto GP Wall Sticker',
  'Wheelie King Wall Sticker',
  'Ride Free Wall Sticker',
  'Iron Horse Wall Sticker',
  'Naked Bike Wall Sticker',
  'Cruiser Life Wall Sticker',
  'Adventure Rider Wall Sticker',
  'Enduro Beast Wall Sticker',
  'Motocross Wall Sticker',
  'Street Fighter Wall Sticker',
  'Rev Head Wall Sticker',
  'Lean And Mean Wall Sticker',
  'Midnight Rider Wall Sticker',
  'Fuel And Fire Wall Sticker',
  'Moto Soul Wall Sticker',
  'Ride The Storm Wall Sticker',
  'Chrome And Steel Wall Sticker',
  'Live To Ride Wall Sticker',
  'Biker Brotherhood Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadBikes() {
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
    const name = BIKE_NAMES[i] || `Bike Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/bikes',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'bike',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality wall sticker featuring iconic bike art. Easy peel and stick. Waterproof and long lasting.',
        tags: ['bike', 'motorcycle', 'wall sticker', 'riding', 'moto'],
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

  console.log('\n🎉 All done! Bike stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadBikes().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
