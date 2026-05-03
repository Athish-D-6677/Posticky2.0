// seedProducts.js — Uses Firebase Admin SDK (bypasses Firestore rules)
// Run: node scripts/seedProducts.js

import admin from 'firebase-admin'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const STICKERS = [
  { name: 'Neon Galaxy Burst Wall Sticker', description: 'A stunning exploding galaxy design with neon purple, blue, and pink hues. Waterproof vinyl. Perfect for bedroom feature walls.', category: 'wall-sticker', price: 349, originalPrice: 499, stock: 42, isActive: true, isNew: true, rating: 4.8, reviewCount: 127, tags: ['galaxy', 'neon', 'bedroom', 'space'], images: ['https://placehold.co/500x500/0d0d1a/00ff88?text=Galaxy+Burst'], variants: { stickerSizes: ['12x12 inch', '18x18 inch', '24x24 inch'], allowCustomText: false } },
  { name: 'Geometric Tiger Portrait Sticker', description: 'Bold low-poly geometric tiger face in orange, black and gold. UV-resistant print, lasts 5+ years.', category: 'wall-sticker', price: 299, originalPrice: 450, stock: 68, isActive: true, isNew: false, rating: 4.7, reviewCount: 89, tags: ['tiger', 'geometric', 'animal', 'bold'], images: ['https://placehold.co/500x500/1a0d00/ff8800?text=Geo+Tiger'], variants: { stickerSizes: ['10x12 inch', '16x20 inch', '20x24 inch'], allowCustomText: false } },
  { name: '"No Rules" Graffiti Typography Sticker', description: 'Street-art inspired graffiti lettering. Matte finish. Removable without residue.', category: 'wall-sticker', price: 199, originalPrice: 299, stock: 120, isActive: true, isNew: false, rating: 4.6, reviewCount: 203, tags: ['graffiti', 'text', 'street', 'room'], images: ['https://placehold.co/500x500/0a0a0a/ff2d78?text=No+Rules'], variants: { stickerSizes: ['12x6 inch', '24x12 inch', '36x18 inch'], allowCustomText: true } },
  { name: 'Anime Samurai Silhouette Sticker', description: 'Epic samurai warrior silhouette against a rising sun. Japanese ink-art style. 3-layer vinyl for crisp edges.', category: 'wall-sticker', price: 379, originalPrice: 499, stock: 35, isActive: true, isNew: true, rating: 4.9, reviewCount: 156, tags: ['anime', 'samurai', 'japan', 'silhouette'], images: ['https://placehold.co/500x500/0a0000/ff4444?text=Samurai'], variants: { stickerSizes: ['12x18 inch', '18x24 inch', '24x36 inch'], allowCustomText: false } },
  { name: 'Cyberpunk City Skyline Sticker', description: 'Neon-lit dystopian cityscape with rain reflections. Holographic ink finish.', category: 'wall-sticker', price: 449, originalPrice: 649, stock: 27, isActive: true, isNew: true, rating: 4.9, reviewCount: 74, tags: ['cyberpunk', 'city', 'neon', 'gaming'], images: ['https://placehold.co/500x500/000d1a/00d4ff?text=Cyberpunk+City'], variants: { stickerSizes: ['24x12 inch', '36x18 inch', '48x24 inch'], allowCustomText: false } },
  { name: 'Botanical Dark Forest Sticker Set', description: 'Set of 3 dark botanical prints — monstera, fern, and palm. Waterproof gloss finish.', category: 'wall-sticker', price: 549, originalPrice: 799, stock: 50, isActive: true, isNew: false, rating: 4.7, reviewCount: 92, tags: ['botanical', 'plants', 'dark', 'set'], images: ['https://placehold.co/500x500/0a1a0a/44ff88?text=Dark+Botanicals'], variants: { stickerSizes: ['8x10 inch each', '12x16 inch each'], allowCustomText: false } },
  { name: 'Mandala Sun & Moon Sticker', description: 'Intricate mandala with celestial sun and crescent moon motifs. Gold metallic ink on matte black.', category: 'wall-sticker', price: 329, originalPrice: 449, stock: 88, isActive: true, isNew: false, rating: 4.8, reviewCount: 211, tags: ['mandala', 'moon', 'sun', 'spiritual'], images: ['https://placehold.co/500x500/0a0a00/ffd700?text=Mandala'], variants: { stickerSizes: ['12x12 inch', '18x18 inch', '24x24 inch'], allowCustomText: false } },
  { name: '"Hustle Hard" Motivational Quote Sticker', description: 'Bold modern typography for your workspace. Matte anti-glare finish.', category: 'wall-sticker', price: 179, originalPrice: 249, stock: 200, isActive: true, isNew: false, rating: 4.5, reviewCount: 318, tags: ['quote', 'motivation', 'office', 'typography'], images: ['https://placehold.co/500x500/0a0a0a/f0f0f0?text=Hustle+Hard'], variants: { stickerSizes: ['18x6 inch', '30x10 inch'], allowCustomText: true } },
  { name: 'Dragon Koi Fish Sticker', description: 'Traditional Japanese koi transforming into a dragon. Vibrant watercolor style.', category: 'wall-sticker', price: 399, originalPrice: 549, stock: 41, isActive: true, isNew: true, rating: 4.8, reviewCount: 63, tags: ['dragon', 'koi', 'japanese', 'colorful'], images: ['https://placehold.co/500x500/000d1a/ff6600?text=Koi+Dragon'], variants: { stickerSizes: ['12x18 inch', '18x24 inch', '24x36 inch'], allowCustomText: false } },
  { name: 'Retro Cassette Wave Sticker', description: 'Y2K retro cassette tape with sound wave art. Chrome metallic and pastel gradient finish.', category: 'wall-sticker', price: 249, originalPrice: 349, stock: 75, isActive: true, isNew: false, rating: 4.6, reviewCount: 144, tags: ['retro', 'cassette', 'music', 'y2k'], images: ['https://placehold.co/500x500/1a001a/ff88ff?text=Retro+Cassette'], variants: { stickerSizes: ['10x8 inch', '16x12 inch', '20x16 inch'], allowCustomText: false } },
]

const TSHIRTS = [
  { name: 'Neon Skull Oversized Tee', description: 'Oversized drop-shoulder tee with a glowing skull graphic. 240 GSM 100% cotton. Washed black. Unisex fit.', category: 'tshirt', price: 699, originalPrice: 999, stock: 60, isActive: true, isNew: true, rating: 4.9, reviewCount: 88, tags: ['skull', 'neon', 'oversized', 'gothic'], images: ['https://placehold.co/500x600/0a0a0a/00ff88?text=Neon+Skull+Tee'], variants: { sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Washed Black', 'Charcoal'], allowCustomText: false } },
  { name: 'Cyberpunk "SYSTEM ERROR" Tee', description: 'Glitched pixel art SYSTEM ERROR front print + barcode back. 220 GSM heavyweight cotton.', category: 'tshirt', price: 649, originalPrice: 899, stock: 85, isActive: true, isNew: false, rating: 4.8, reviewCount: 196, tags: ['cyberpunk', 'glitch', 'tech', 'oversized'], images: ['https://placehold.co/500x600/000808/00d4ff?text=System+Error'], variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Navy'], allowCustomText: false } },
  { name: 'Anime Eyes Crop Tee', description: 'Minimal close-up anime eyes graphic on a fitted crop cut. 100% ring-spun cotton, 200 GSM.', category: 'tshirt', price: 549, originalPrice: 749, stock: 40, isActive: true, isNew: true, rating: 4.7, reviewCount: 72, tags: ['anime', 'crop', 'minimal', 'cute'], images: ['https://placehold.co/500x600/0a0a0a/ff2d78?text=Anime+Eyes'], variants: { sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Pink'], allowCustomText: false } },
  { name: '"No Signal" Distressed Graphic Tee', description: 'Vintage distressed TV static print. Acid-washed for that worn-in look. 250 GSM heavyweight.', category: 'tshirt', price: 699, originalPrice: 999, stock: 55, isActive: true, isNew: false, rating: 4.8, reviewCount: 141, tags: ['distressed', 'vintage', 'graphic', 'oversized'], images: ['https://placehold.co/500x600/111111/888888?text=No+Signal'], variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Acid Black', 'Acid Grey'], allowCustomText: false } },
  { name: 'Custom Name Neon Drop Tee', description: 'Personalized tee with your name in neon drip font. High-density screen print. 220 GSM.', category: 'tshirt', price: 799, originalPrice: 1099, stock: 100, isActive: true, isNew: false, rating: 4.9, reviewCount: 309, tags: ['custom', 'personalized', 'name', 'gift'], images: ['https://placehold.co/500x600/0a0a0a/ffcc00?text=Custom+Name'], variants: { sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'White', 'Olive'], allowCustomText: true, customTextLabel: 'Enter your name' } },
  { name: 'Street Kanji Oversized Tee', description: 'Japanese kanji for "freedom" in bold brushstroke style. 240 GSM. Back print included.', category: 'tshirt', price: 649, originalPrice: 849, stock: 70, isActive: true, isNew: true, rating: 4.7, reviewCount: 58, tags: ['kanji', 'japanese', 'streetwear', 'oversized'], images: ['https://placehold.co/500x600/0a0a0a/ffffff?text=Kanji+Tee'], variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Beige', 'Vintage White'], allowCustomText: false } },
  { name: 'Galaxy Tie-Dye Tee', description: 'Hand tie-dyed galaxy pattern in deep purple, blue, and pink. Each piece is one-of-a-kind. 100% cotton.', category: 'tshirt', price: 749, originalPrice: 999, stock: 30, isActive: true, isNew: false, rating: 4.8, reviewCount: 184, tags: ['tie-dye', 'galaxy', 'unique', 'colorful'], images: ['https://placehold.co/500x600/0d0020/cc44ff?text=Galaxy+Tie-Dye'], variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Purple Galaxy', 'Blue Nebula', 'Pink Storm'], allowCustomText: false } },
  { name: '"Born Different" Acid Wash Tee', description: 'Minimalist slogan tee with textured acid wash finish and small chest logo. 220 GSM cotton.', category: 'tshirt', price: 599, originalPrice: 799, stock: 90, isActive: true, isNew: false, rating: 4.6, reviewCount: 267, tags: ['slogan', 'acid-wash', 'minimal', 'classic'], images: ['https://placehold.co/500x600/111111/dddddd?text=Born+Different'], variants: { sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Acid Black', 'Acid Blue'], allowCustomText: false } },
  { name: 'Dragon Back Print Tee', description: 'Full-back large dragon in Chinese watercolor ink style. Front: small dragon logo. 250 GSM premium cotton.', category: 'tshirt', price: 849, originalPrice: 1199, stock: 25, isActive: true, isNew: true, rating: 4.9, reviewCount: 43, tags: ['dragon', 'back-print', 'premium', 'art'], images: ['https://placehold.co/500x600/080808/ff4400?text=Dragon+Back'], variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Dark Navy'], allowCustomText: false } },
  { name: 'Posticky OG Logo Tee', description: 'Official Posticky brand tee. Embroidered logo on chest. 100% combed cotton 220 GSM.', category: 'tshirt', price: 499, originalPrice: 699, stock: 150, isActive: true, isNew: false, rating: 4.7, reviewCount: 412, tags: ['brand', 'logo', 'classic', 'everyday'], images: ['https://placehold.co/500x600/0a0a0a/00ff88?text=Posticky+OG'], variants: { sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], colors: ['Black', 'White', 'Olive Green', 'Charcoal'], allowCustomText: false } },
]

async function seedProducts() {
  console.log('🌱 Starting Posticky product seed (Admin SDK)...\n')
  const allProducts = [...STICKERS, ...TSHIRTS]
  let count = 0
  for (const product of allProducts) {
    try {
      const docRef = await db.collection('products').add({
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      count++
      console.log(`✅ [${count}/${allProducts.length}] ${product.name} → ${docRef.id}`)
    } catch (err) {
      console.error(`❌ Failed: ${product.name} →`, err.message)
    }
  }
  console.log(`\n🎉 Done! ${count}/${allProducts.length} products added to Firestore.`)
  process.exit(0)
}

seedProducts()