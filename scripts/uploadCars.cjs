// Run: node scripts/uploadCars.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T220329Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const CAR_NAMES = [
  'Supercar Speed Wall Sticker',
  'Classic Muscle Car Wall Sticker',
  'Sports Car Drift Wall Sticker',
  'Turbo Boost Wall Sticker',
  'Vintage Racer Wall Sticker',
  'Street Racing Wall Sticker',
  'Luxury Drive Wall Sticker',
  'Fast Lane Wall Sticker',
  'Rev It Up Wall Sticker',
  'Nitro Rush Wall Sticker',
  'Track Day Wall Sticker',
  'Horsepower Wall Sticker',
  'Burnout King Wall Sticker',
  'Drag Race Wall Sticker',
  'Pit Stop Wall Sticker',
  'Carbon Fibre Wall Sticker',
  'Throttle Up Wall Sticker',
  'Midnight Drive Wall Sticker',
  'Neon Racer Wall Sticker',
  'Garage Life Wall Sticker',
  'Petrolhead Wall Sticker',
  'Zero To Hundred Wall Sticker',
  'Stance Nation Wall Sticker',
  'JDM Culture Wall Sticker',
  'Euro Spec Wall Sticker',
  'American Muscle Wall Sticker',
  'Off Road Beast Wall Sticker',
  'Rally Car Wall Sticker',
  'Formula One Wall Sticker',
  'Checkered Flag Wall Sticker',
  'Exhaust Note Wall Sticker',
  'Lowrider Wall Sticker',
  'Drift King Wall Sticker',
  'Turbo Charged Wall Sticker',
  'Speed Demon Wall Sticker',
  'Born To Drive Wall Sticker',
  'Road Trip Wall Sticker',
  'Vroom Vroom Wall Sticker',
  'Car Enthusiast Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadCars() {
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
    const name = CAR_NAMES[i] || `Car Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/cars',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'car',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality wall sticker featuring iconic car art. Easy peel and stick. Waterproof and long lasting.',
        tags: ['car', 'racing', 'wall sticker', 'automobile', 'speed'],
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

  console.log('\n🎉 All done! Car stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadCars().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
