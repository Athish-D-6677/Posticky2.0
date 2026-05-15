const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')

// =======================
// FIREBASE CONFIG
// =======================
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// =======================
// CLOUDINARY CONFIG
// =======================
cloudinary.config({
  cloud_name: 'dvbzqythk',
  api_key: '347261755443642',
  api_secret: '0gFexqcAFV_fgWHO1F5WTIfHgPE',
})

// =======================
// IMAGE FOLDER
// =======================
const imageFolder =
  'C:/Users/91948/Downloads/drive-download-20260515T202724Z-3-001'

// =======================
// READ FILES
// =======================
const files = fs.readdirSync(imageFolder)

async function uploadImages() {
  for (const file of files) {
    try {
      const filePath = path.join(imageFolder, file)

      console.log(`Uploading ${file}...`)

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'products',
      })

      console.log(`Uploaded: ${result.secure_url}`)

      // Product Name
      const productName = path.parse(file).name

      // Save to Firestore
      await db.collection('products').add({
        name: productName,
        description: `${productName} premium wall sticker`,
        category: 'wall-sticker',

        theme: 'quotes',

        price: 299,
        originalPrice: 499,

        stock: 100,

        isActive: true,
        isNew: true,

        rating: 4.5,
        reviewCount: 0,

        tags: ['quotes', 'wall-art', 'sticker'],

        images: [result.secure_url],

        variants: {
          stickerSizes: [
            '10x12 inch',
            '16x20 inch',
            '20x24 inch',
          ],
          allowCustomText: false,
        },

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      console.log(`Saved to Firestore: ${productName}`)
    } catch (err) {
      console.error(`Error uploading ${file}`, err)
    }
  }

  console.log('✅ All products uploaded successfully')
}

uploadImages()