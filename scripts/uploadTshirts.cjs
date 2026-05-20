const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

cloudinary.config({
  cloud_name: 'dvbzqythk',
  api_key: '347261755443642',
  api_secret: '0gFexqcAFV_fgWHO1F5WTIfHgPE',
})

const images = [
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233814_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233820_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233824_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233826_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233829_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233831_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233835_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233841_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233843_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233845_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233848_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233851_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233853_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233856_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233859_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233906_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233908_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233910_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233912_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233913_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233915_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233922_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233923_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233924_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233925_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233926_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233927_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233928_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233936_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233937_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233938_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233941_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233948_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233949_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233951_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233953_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-233954_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234017_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234019_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234020_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234021_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234051_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234055_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234057_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234059_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234102_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234103_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234108_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234114_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234117_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234119_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234124_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234125_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234126_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234133_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234136_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234138_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234139_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234142_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234147_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234149_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234150_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234151_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234152_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234153_result - Copy.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234154 (1)_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234154_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234159_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234206_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234213_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234215_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234216_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234218_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234219_result.png",
  "C:/Users/91948/OneDrive/Pictures/Screenshots/Screenshot_20260520-234220_result.png",
]

async function uploadTshirts() {
  let count = 1
  for (const filePath of images) {
    try {
      console.log(`[${count}/${images.length}] Uploading ${path.basename(filePath)}...`)

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'tshirts',
      })

      const productName = `T-Shirt Design ${count}`

      await db.collection('products').add({
        name: productName,
        description: `${productName} - premium oversized streetwear tshirt`,
        category: 'tshirt',
        theme: 'uncategorized', // change later from admin dashboard
        price: 499,
        originalPrice: 799,
        stock: 50,
        isActive: false, // hidden until you set the theme
        isNew: true,
        rating: 0,
        reviewCount: 0,
        tags: ['tshirt', 'streetwear'],
        images: [result.secure_url],
        variants: {
          sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Oversize'],
          allowCustomText: false,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      console.log(`✅ Saved: ${productName}`)
      count++
    } catch (err) {
      console.error(`❌ Error on ${path.basename(filePath)}:`, err.message)
      count++
    }
  }

  console.log('\n✅ All t-shirt products uploaded! Go to admin dashboard to set themes and activate.')
}

uploadTshirts()
