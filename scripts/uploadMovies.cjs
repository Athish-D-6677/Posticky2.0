// Run: node scripts/uploadMovies.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T214537Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp']

const MOVIE_NAMES = [
  'Classic Movie Quote Wall Sticker',
  'Iconic Movie Scene Wall Sticker',
  'Hollywood Legends Wall Sticker',
  'Blockbuster Movie Wall Sticker',
  'Cinema Vibes Wall Sticker',
  'Movie Night Wall Sticker',
  'Silver Screen Wall Sticker',
  'Epic Movie Moment Wall Sticker',
  'Cult Classic Wall Sticker',
  'Box Office Hit Wall Sticker',
  'Director\'s Cut Wall Sticker',
  'Reel Life Wall Sticker',
  'Lights Camera Action Wall Sticker',
  'Movie Magic Wall Sticker',
  'Cinematic Wall Sticker',
  'Film Fanatic Wall Sticker',
  'Scene Stealer Wall Sticker',
  'Award Winner Wall Sticker',
  'Popcorn Time Wall Sticker',
  'Movie Buff Wall Sticker',
  'Legendary Film Wall Sticker',
  'Timeless Classic Wall Sticker',
  'Big Screen Wall Sticker',
  'Fan Favourite Wall Sticker',
  'Movie Marathon Wall Sticker',
  'Harry Potter Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadMovies() {
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
    const name = MOVIE_NAMES[i] || `Movie Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/movies',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'movie',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality wall sticker featuring iconic movie art. Easy peel and stick. Waterproof and long lasting.',
        tags: ['movie', 'cinema', 'wall sticker', 'film'],
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

  console.log('\n🎉 All done! Movie stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadMovies().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
