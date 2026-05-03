// Run: node scripts/seedProducts.cjs
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

const stickers = [
  {
    name: 'Mandala Lotus Wall Sticker',
    price: 299, originalPrice: 499, stock: 50,
    description: 'Beautiful mandala lotus design perfect for bedroom walls.',
    tags: ['mandala', 'lotus', 'bedroom'],
    images: ['https://picsum.photos/seed/sticker1/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false },
  },
  {
    name: 'Geometric Mountain Sticker',
    price: 349, originalPrice: 599, stock: 35,
    description: 'Minimalist geometric mountain range. Great for living rooms.',
    tags: ['geometric', 'mountain', 'minimal'],
    images: ['https://picsum.photos/seed/sticker2/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false },
  },
  {
    name: 'Floral Vine Border Sticker',
    price: 199, originalPrice: 349, stock: 80,
    description: 'Elegant floral vine border to frame your walls or mirrors.',
    tags: ['floral', 'vine', 'border'],
    images: ['https://picsum.photos/seed/sticker3/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false },
  },
  {
    name: 'Custom Name Wall Sticker',
    price: 399, originalPrice: 599, stock: 100,
    description: 'Personalized name or quote wall sticker in your chosen size.',
    tags: ['custom', 'name', 'personalized'],
    images: ['https://picsum.photos/seed/sticker4/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: true, customTextLabel: 'Enter your name or quote' },
  },
  {
    name: 'Galaxy Space Wall Sticker',
    price: 449, originalPrice: 699, stock: 25,
    description: 'Stunning galaxy themed sticker. Perfect for kids rooms and gaming setups.',
    tags: ['galaxy', 'space', 'kids'],
    images: ['https://picsum.photos/seed/sticker5/600/600'],
    variants: { stickerSizes: ['45x45cm', '60x60cm', '90x90cm'], allowCustomText: false },
  },
  {
    name: 'Tropical Leaves Sticker',
    price: 279, originalPrice: 449, stock: 60,
    description: 'Lush tropical leaves design to bring nature indoors.',
    tags: ['tropical', 'leaves', 'nature'],
    images: ['https://picsum.photos/seed/sticker6/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false },
  },
  {
    name: 'Abstract Watercolor Sticker',
    price: 329, originalPrice: 549, stock: 40,
    description: 'Vibrant abstract watercolor splash. Adds color to any plain wall.',
    tags: ['abstract', 'watercolor', 'colorful'],
    images: ['https://picsum.photos/seed/sticker7/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false },
  },
  {
    name: 'Motivational Quote Sticker',
    price: 249, originalPrice: 399, stock: 90,
    description: 'Dream Big Work Hard motivational wall sticker for offices and study rooms.',
    tags: ['quote', 'motivational', 'office'],
    images: ['https://picsum.photos/seed/sticker8/600/600'],
    variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: true, customTextLabel: 'Enter your custom quote' },
  },
]

const tshirts = [
  {
    name: 'Mandala Art Printed T-Shirt',
    price: 499, originalPrice: 799, stock: 45,
    description: 'Premium 100% cotton T-shirt with intricate mandala art print.',
    tags: ['mandala', 'art', 'cotton'],
    images: ['https://picsum.photos/seed/tshirt1/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], allowCustomText: false },
  },
  {
    name: 'Galaxy Graphic T-Shirt',
    price: 549, originalPrice: 899, stock: 30,
    description: 'Stunning galaxy print on premium fabric with glow-in-the-dark ink.',
    tags: ['galaxy', 'graphic', 'glow'],
    images: ['https://picsum.photos/seed/tshirt2/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], allowCustomText: false },
  },
  {
    name: 'Custom Name T-Shirt',
    price: 599, originalPrice: 999, stock: 100,
    description: 'Personalized T-shirt with your name printed on the front. Perfect gift.',
    tags: ['custom', 'personalized', 'gift'],
    images: ['https://picsum.photos/seed/tshirt3/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], allowCustomText: true, customTextLabel: 'Enter name to print on shirt' },
  },
  {
    name: 'Minimalist Line Art T-Shirt',
    price: 449, originalPrice: 699, stock: 55,
    description: 'Clean minimalist line art on a classic white tee. Simple yet stylish.',
    tags: ['minimal', 'line art', 'classic'],
    images: ['https://picsum.photos/seed/tshirt4/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], allowCustomText: false },
  },
  {
    name: 'Vintage Retro T-Shirt',
    price: 529, originalPrice: 849, stock: 20,
    description: 'Retro vintage style with distressed effect. Oversized relaxed fit.',
    tags: ['vintage', 'retro', 'oversized'],
    images: ['https://picsum.photos/seed/tshirt5/600/600'],
    variants: { sizes: ['M', 'L', 'XL', 'XXL'], allowCustomText: false },
  },
  {
    name: 'Floral Boho T-Shirt',
    price: 479, originalPrice: 749, stock: 65,
    description: 'Bohemian floral print. Lightweight fabric perfect for summer.',
    tags: ['floral', 'boho', 'summer'],
    images: ['https://picsum.photos/seed/tshirt6/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], allowCustomText: false },
  },
  {
    name: 'Abstract Geometric T-Shirt',
    price: 519, originalPrice: 829, stock: 38,
    description: 'Bold abstract geometric pattern with eco-friendly inks. Unisex fit.',
    tags: ['abstract', 'geometric', 'unisex'],
    images: ['https://picsum.photos/seed/tshirt7/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL', 'XXL'], allowCustomText: false },
  },
  {
    name: 'Anime Sketch T-Shirt',
    price: 559, originalPrice: 899, stock: 42,
    description: 'Hand-drawn anime sketch style print. A must-have for anime fans.',
    tags: ['anime', 'sketch', 'fan'],
    images: ['https://picsum.photos/seed/tshirt8/600/600'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], allowCustomText: false },
  },
]

async function seed() {
  console.log('Seeding 16 products...\n')
  const all = [
    ...stickers.map((p) => ({ ...p, category: 'wall-sticker' })),
    ...tshirts.map((p) => ({ ...p, category: 'tshirt' })),
  ]
  for (const product of all) {
    await db.collection('products').add({
      ...product,
      isActive: true,
      couponIds: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log('✓ Added:', product.name)
  }
  console.log('\n✅ Done! 16 products seeded (8 stickers + 8 T-shirts)')
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
