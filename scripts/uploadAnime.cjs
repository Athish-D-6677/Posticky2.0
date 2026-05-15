// Run: node scripts/uploadAnime.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T225227Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const ANIME_NAMES = [
  'Naruto Ninja Way Wall Sticker',
  'Dragon Ball Power Wall Sticker',
  'One Piece Adventure Wall Sticker',
  'Attack On Titan Wall Sticker',
  'Demon Slayer Wall Sticker',
  'My Hero Academia Wall Sticker',
  'Death Note Wall Sticker',
  'Sword Art Online Wall Sticker',
  'Tokyo Ghoul Wall Sticker',
  'Jujutsu Kaisen Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadAnime() {
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
    const name = ANIME_NAMES[i] || `Anime Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/anime',
        use_filename: false,
        unique_filename: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'anime',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality anime wall sticker for true fans. Easy peel and stick. Waterproof and long lasting.',
        tags: ['anime', 'manga', 'wall sticker', 'otaku', 'japan'],
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

  console.log('\n🎉 All done! Anime stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadAnime().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
