// Run: node scripts/uploadGym.cjs
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

const IMAGES_DIRS = [
  'C:/Users/91948/Downloads/drive-download-20260515T230745Z-3-001',
  'C:/Users/91948/Downloads/drive-download-20260515T230912Z-3-001',
]
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const GYM_NAMES = [
  'Beast Mode Wall Sticker',
  'No Pain No Gain Wall Sticker',
  'Lift Heavy Wall Sticker',
  'Grind Never Stops Wall Sticker',
  'Iron Will Wall Sticker',
  'Train Insane Wall Sticker',
  'Sweat Now Shine Later Wall Sticker',
  'Stronger Every Day Wall Sticker',
  'Push Your Limits Wall Sticker',
  'Gains All Day Wall Sticker',
  'Eat Sleep Gym Repeat Wall Sticker',
  'Built Not Born Wall Sticker',
  'One More Rep Wall Sticker',
  'Deadlift King Wall Sticker',
  'Squat Goals Wall Sticker',
  'Cardio Kills Wall Sticker',
  'Muscle Up Wall Sticker',
  'Gym Is My Therapy Wall Sticker',
  'Hustle For That Muscle Wall Sticker',
  'Stay Hard Wall Sticker',
  'Discipline Over Motivation Wall Sticker',
  'Protein And Progress Wall Sticker',
  'Flex On Em Wall Sticker',
  'Never Skip Leg Day Wall Sticker',
  'Warrior Mindset Wall Sticker',
  'Champions Are Made In The Gym Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadGym() {
  // Collect all files from both folders
  const allFiles = []
  for (const dir of IMAGES_DIRS) {
    const files = fs.readdirSync(dir)
      .filter(f => VALID_EXTS.includes(path.extname(f).toLowerCase()))
      .map(f => ({ file: f, dir }))
    allFiles.push(...files)
  }

  if (!allFiles.length) {
    console.log('No images found in folders.')
    return
  }

  console.log(`Found ${allFiles.length} images. Uploading to Cloudinary + saving to Firestore...\n`)

  for (let i = 0; i < allFiles.length; i++) {
    const { file, dir } = allFiles[i]
    const filePath = path.join(dir, file)
    const name = GYM_NAMES[i] || `Gym Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/gym',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'gym',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality gym wall sticker to fuel your grind. Easy peel and stick. Waterproof and long lasting.',
        tags: ['gym', 'fitness', 'wall sticker', 'workout', 'motivation'],
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

  console.log('\n🎉 All done! Gym stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadGym().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
