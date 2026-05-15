// Run: node scripts/uploadMusic.cjs
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

const IMAGES_DIR = 'C:/Users/91948/Downloads/drive-download-20260515T214943Z-3-001'
const VALID_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MUSIC_NAMES = [
  'Music Is Life Wall Sticker',
  'Rock On Wall Sticker',
  'Headphones Vibes Wall Sticker',
  'Beat Drop Wall Sticker',
  'Guitar Soul Wall Sticker',
  'Piano Keys Wall Sticker',
  'Music Notes Wall Sticker',
  'Vinyl Record Wall Sticker',
  'Bass Boost Wall Sticker',
  'Melody Forever Wall Sticker',
  'Live Music Wall Sticker',
  'Sound Waves Wall Sticker',
  'Acoustic Dreams Wall Sticker',
  'Rhythm And Blues Wall Sticker',
  'Hip Hop Culture Wall Sticker',
  'Jazz Vibes Wall Sticker',
  'Classic Rock Wall Sticker',
  'EDM Drop Wall Sticker',
  'Studio Session Wall Sticker',
  'Mic Drop Wall Sticker',
  'Turn It Up Wall Sticker',
  'Feel The Music Wall Sticker',
  'Born To Rock Wall Sticker',
  'Music Heals Wall Sticker',
  'Loud And Proud Wall Sticker',
  'Tune In Wall Sticker',
  'Playlist Mood Wall Sticker',
  'Concert Night Wall Sticker',
  'Stage Lights Wall Sticker',
  'Drum Beat Wall Sticker',
  'Strings Attached Wall Sticker',
  'Treble Clef Wall Sticker',
  'Music Never Stops Wall Sticker',
  'Retro Cassette Wall Sticker',
  'Boom Box Wall Sticker',
  'Frequency Wall Sticker',
  'Amplify Wall Sticker',
  'Soulful Tunes Wall Sticker',
  'Rap God Wall Sticker',
  'Pop Star Wall Sticker',
  'Metal Head Wall Sticker',
  'Indie Vibes Wall Sticker',
  'Chill Beats Wall Sticker',
  'Music Festival Wall Sticker',
  'Earphones Always Wall Sticker',
  'Sing Your Heart Out Wall Sticker',
  'Backstage Pass Wall Sticker',
  'Music Is My Therapy Wall Sticker',
  'Forever On Repeat Wall Sticker',
]

const PRICES = [199, 249, 299, 349, 399]
const ORIGINAL_PRICES = [349, 399, 499, 549, 599]
const SIZES = ['30x30cm', '45x45cm', '60x60cm', '90x90cm']

async function uploadMusic() {
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
    const name = MUSIC_NAMES[i] || `Music Wall Sticker ${i + 1}`
    const price = PRICES[i % PRICES.length]
    const originalPrice = ORIGINAL_PRICES[i % ORIGINAL_PRICES.length]

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'posticky/products/music',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })

      const imageUrl = result.secure_url

      await db.collection('products').add({
        name,
        category: 'wall-sticker',
        theme: 'music',
        price,
        originalPrice,
        stock: 50,
        description: 'Premium quality wall sticker with music-inspired art. Easy peel and stick. Waterproof and long lasting.',
        tags: ['music', 'wall sticker', 'beats', 'rock', 'melody'],
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

  console.log('\n🎉 All done! Music stickers uploaded to Cloudinary and saved to Firestore.')
  process.exit(0)
}

uploadMusic().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
