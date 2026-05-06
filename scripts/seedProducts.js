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
  {
    name: 'Minimal Line Art Face Sticker',
    description: 'Elegant single-line face art for modern interiors. Matte black finish.',
    category: 'wall-sticker',
    price: 249,
    originalPrice: 399,
    stock: 80,
    isActive: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 64,
    tags: ['minimal', 'line-art', 'modern'],
    images: ['https://placehold.co/500x500/ffffff/000000?text=Line+Art'],
    variants: {
      stickerSizes: ['20x20cm', '40x40cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Gaming Controller Neon Sticker',
    description: 'RGB glowing gaming controller design for gamers setup.',
    category: 'wall-sticker',
    price: 299,
    originalPrice: 449,
    stock: 70,
    isActive: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 112,
    tags: ['gaming', 'neon', 'controller'],
    images: ['https://placehold.co/500x500/0a0a0a/00ffcc?text=Gaming'],
    variants: {
      stickerSizes: ['25x25cm', '45x45cm', '70x70cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Mountain Adventure Sticker',
    description: 'Scenic mountain landscape sticker for travel lovers.',
    category: 'wall-sticker',
    price: 279,
    originalPrice: 429,
    stock: 60,
    isActive: true,
    isNew: false,
    rating: 4.6,
    reviewCount: 90,
    tags: ['mountain', 'travel', 'nature'],
    images: ['https://placehold.co/500x500/002b36/00ff88?text=Mountain'],
    variants: {
      stickerSizes: ['30x20cm', '60x40cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Space Astronaut Floating Sticker',
    description: 'Cool astronaut floating in space. Perfect for sci-fi lovers.',
    category: 'wall-sticker',
    price: 349,
    originalPrice: 549,
    stock: 50,
    isActive: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 150,
    tags: ['space', 'astronaut', 'sci-fi'],
    images: ['https://placehold.co/500x500/000814/ffffff?text=Astronaut'],
    variants: {
      stickerSizes: ['30x30cm', '60x60cm', '90x90cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Custom Name Graffiti Sticker',
    description: 'Personalized graffiti style sticker with your name.',
    category: 'wall-sticker',
    price: 399,
    originalPrice: 599,
    stock: 100,
    isActive: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 180,
    tags: ['custom', 'graffiti', 'name'],
    images: ['https://placehold.co/500x500/0a0a0a/ff00aa?text=Custom+Name'],
    variants: {
      stickerSizes: ['30x30cm', '60x60cm'],
      allowCustomText: true,
      customTextLabel: 'Enter your name'
    }
  },

  
  {
    name: 'Naruto Kunai Wall Sticker',
    description: 'Iconic Naruto kunai and leaf village symbol sticker for anime fans.',
    category: 'wall-sticker',
    price: 349,
    originalPrice: 549,
    stock: 60,
    isActive: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 120,
    tags: ['naruto', 'anime', 'ninja'],
    images: ['https://cdn.myanimelist.net/images/anime/1141/142503.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Dragon Ball Z Scouter Sticker',
    description: 'DBZ scouter design wall sticker. Power level over 9000!',
    category: 'wall-sticker',
    price: 299,
    originalPrice: 499,
    stock: 75,
    isActive: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 95,
    tags: ['dragonball', 'anime', 'dbz'],
    images: ['https://cdn.myanimelist.net/images/anime/1277/142022.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Attack on Titan Survey Corps Sticker',
    description: 'Survey Corps wings of freedom emblem wall sticker.',
    category: 'wall-sticker',
    price: 379,
    originalPrice: 599,
    stock: 45,
    isActive: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 110,
    tags: ['aot', 'anime', 'survey corps'],
    images: ['https://cdn.myanimelist.net/images/anime/10/47347.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'],
      allowCustomText: false
    }
  },
  {
    name: 'One Piece Jolly Roger Sticker',
    description: 'Straw Hat Pirates Jolly Roger wall sticker for One Piece fans.',
    category: 'wall-sticker',
    price: 319,
    originalPrice: 519,
    stock: 55,
    isActive: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 102,
    tags: ['one piece', 'anime', 'luffy'],
    images: ['https://cdn.myanimelist.net/images/anime/6/73245.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Demon Slayer Breathing Form Sticker',
    description: 'Tanjiro water breathing form silhouette wall sticker.',
    category: 'wall-sticker',
    price: 399,
    originalPrice: 649,
    stock: 40,
    isActive: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 130,
    tags: ['demon slayer', 'anime', 'tanjiro'],
    images: ['https://cdn.myanimelist.net/images/anime/1286/99889.jpg'],
    variants: {
      stickerSizes: ['45x45cm', '60x60cm', '90x90cm'],
      allowCustomText: false
    }
  },
  {
    name: 'My Hero Academia Plus Ultra Sticker',
    description: 'Plus Ultra! MHA hero emblems wall sticker set.',
    category: 'wall-sticker',
    price: 329,
    originalPrice: 529,
    stock: 65,
    isActive: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 88,
    tags: ['mha', 'anime', 'hero'],
    images: ['https://cdn.myanimelist.net/images/anime/10/78745.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Totoro Forest Spirit Sticker',
    description: 'Adorable Totoro and friends wall sticker. Perfect for kids rooms.',
    category: 'wall-sticker',
    price: 359,
    originalPrice: 579,
    stock: 70,
    isActive: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 140,
    tags: ['ghibli', 'totoro', 'anime'],
    images: ['https://cdn.myanimelist.net/images/anime/4/75923.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Sword Art Online Kirito Sticker',
    description: 'Kirito dual-wielding silhouette wall sticker for SAO fans.',
    category: 'wall-sticker',
    price: 349,
    originalPrice: 549,
    stock: 50,
    isActive: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 97,
    tags: ['sao', 'anime', 'kirito'],
    images: ['https://cdn.myanimelist.net/images/anime/11/39717.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm'],
      allowCustomText: false
    }
  },
  {
    name: 'Custom Anime Quote Sticker',
    description: 'Personalized anime-style quote wall sticker in your chosen size.',
    category: 'wall-sticker',
    price: 429,
    originalPrice: 679,
    stock: 90,
    isActive: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 150,
    tags: ['custom', 'anime', 'quote'],
    images: ['https://cdn.myanimelist.net/images/anime/1337/99013.jpg'],
    variants: {
      stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'],
      allowCustomText: true,
      customTextLabel: 'Enter your anime quote'
    }
  },
  {
    name: 'Fullmetal Alchemist Transmutation Circle Sticker',
    description: 'Detailed FMA transmutation circle wall sticker. Intricate alchemist design.',
    category: 'wall-sticker',
    price: 389,
    originalPrice: 629,
    stock: 35,
    isActive: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 85,
    tags: ['fma', 'anime', 'alchemist'],
    images: ['https://cdn.myanimelist.net/images/anime/1223/96541.jpg'],
    variants: {
      stickerSizes: ['45x45cm', '60x60cm', '90x90cm'],
      allowCustomText: false
    }
  },

  { name: 'Geometric Tiger Portrait Sticker', description: 'Bold low-poly geometric tiger face in orange, black and gold. UV-resistant print, lasts 5+ years.', category: 'wall-sticker', price: 299, originalPrice: 450, stock: 68, isActive: true, isNew: false, rating: 4.7, reviewCount: 89, tags: ['tiger', 'geometric', 'animal', 'bold'], images: ['https://placehold.co/500x500/1a0d00/ff8800?text=Geo+Tiger'], variants: { stickerSizes: ['10x12 inch', '16x20 inch', '20x24 inch'], allowCustomText: false } },
  { name: '"No Rules" Graffiti Typography Sticker', description: 'Street-art inspired graffiti lettering. Matte finish. Removable without residue.', category: 'wall-sticker', price: 199, originalPrice: 299, stock: 120, isActive: true, isNew: false, rating: 4.6, reviewCount: 203, tags: ['graffiti', 'text', 'street', 'room'], images: ['https://placehold.co/500x500/0a0a0a/ff2d78?text=No+Rules'], variants: { stickerSizes: ['12x6 inch', '24x12 inch', '36x18 inch'], allowCustomText: true } },
  { name: 'Anime Samurai Silhouette Sticker', description: 'Epic samurai warrior silhouette against a rising sun. Japanese ink-art style. 3-layer vinyl for crisp edges.', category: 'wall-sticker', price: 379, originalPrice: 499, stock: 35, isActive: true, isNew: true, rating: 4.9, reviewCount: 156, tags: ['anime', 'samurai', 'japan', 'silhouette'], images: ['https://placehold.co/500x500/0a0000/ff4444?text=Samurai'], variants: { stickerSizes: ['12x18 inch', '18x24 inch', '24x36 inch'], allowCustomText: false } },
  { name: 'Cyberpunk City Skyline Sticker', description: 'Neon-lit dystopian cityscape with rain reflections. Holographic ink finish.', category: 'wall-sticker', price: 449, originalPrice: 649, stock: 27, isActive: true, isNew: true, rating: 4.9, reviewCount: 74, tags: ['cyberpunk', 'city', 'neon', 'gaming'], images: ['https://placehold.co/500x500/000d1a/00d4ff?text=Cyberpunk+City'], variants: { stickerSizes: ['24x12 inch', '36x18 inch', '48x24 inch'], allowCustomText: false } },
  { name: 'Botanical Dark Forest Sticker Set', description: 'Set of 3 dark botanical prints — monstera, fern, and palm. Waterproof gloss finish.', category: 'wall-sticker', price: 549, originalPrice: 799, stock: 50, isActive: true, isNew: false, rating: 4.7, reviewCount: 92, tags: ['botanical', 'plants', 'dark', 'set'], images: ['https://placehold.co/500x500/0a1a0a/44ff88?text=Dark+Botanicals'], variants: { stickerSizes: ['8x10 inch each', '12x16 inch each'], allowCustomText: false } },
  { name: 'Mandala Sun & Moon Sticker', description: 'Intricate mandala with celestial sun and crescent moon motifs. Gold metallic ink on matte black.', category: 'wall-sticker', price: 329, originalPrice: 449, stock: 88, isActive: true, isNew: false, rating: 4.8, reviewCount: 211, tags: ['mandala', 'moon', 'sun', 'spiritual'], images: ['https://placehold.co/500x500/0a0a00/ffd700?text=Mandala'], variants: { stickerSizes: ['12x12 inch', '18x18 inch', '24x24 inch'], allowCustomText: false } },
  { name: '"Hustle Hard" Motivational Quote Sticker', description: 'Bold modern typography for your workspace. Matte anti-glare finish.', category: 'wall-sticker', price: 179, originalPrice: 249, stock: 200, isActive: true, isNew: false, rating: 4.5, reviewCount: 318, tags: ['quote', 'motivation', 'office', 'typography'], images: ['https://placehold.co/500x500/0a0a0a/f0f0f0?text=Hustle+Hard'], variants: { stickerSizes: ['18x6 inch', '30x10 inch'], allowCustomText: true } },
  { name: 'Dragon Koi Fish Sticker', description: 'Traditional Japanese koi transforming into a dragon. Vibrant watercolor style.', category: 'wall-sticker', price: 399, originalPrice: 549, stock: 41, isActive: true, isNew: true, rating: 4.8, reviewCount: 63, tags: ['dragon', 'koi', 'japanese', 'colorful'], images: ['https://placehold.co/500x500/000d1a/ff6600?text=Koi+Dragon'], variants: { stickerSizes: ['12x18 inch', '18x24 inch', '24x36 inch'], allowCustomText: false } },
  { name: 'Retro Cassette Wave Sticker', description: 'Y2K retro cassette tape with sound wave art. Chrome metallic and pastel gradient finish.', category: 'wall-sticker', price: 249, originalPrice: 349, stock: 75, isActive: true, isNew: false, rating: 4.6, reviewCount: 144, tags: ['retro', 'cassette', 'music', 'y2k'], images: ['https://placehold.co/500x500/1a001a/ff88ff?text=Retro+Cassette'], variants: { stickerSizes: ['10x8 inch', '16x12 inch', '20x16 inch'], allowCustomText: false } },
  { name: 'Lion King Roar Sticker', description: 'Majestic lion roaring in watercolor splash style. Bold and powerful wall art.', category: 'wall-sticker', price: 319, originalPrice: 499, stock: 55, isActive: true, isNew: true, rating: 4.8, reviewCount: 76, tags: ['lion', 'animal', 'watercolor', 'bold'], images: ['https://placehold.co/500x500/1a0800/ff8800?text=Lion+King'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Butterfly Garden Sticker', description: 'Colorful butterfly cluster in vibrant watercolor. Perfect for kids rooms and nurseries.', category: 'wall-sticker', price: 249, originalPrice: 399, stock: 90, isActive: true, isNew: false, rating: 4.7, reviewCount: 132, tags: ['butterfly', 'colorful', 'kids', 'nature'], images: ['https://placehold.co/500x500/0a001a/ff88cc?text=Butterfly'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'World Map Vintage Sticker', description: 'Antique-style world map with compass rose. Sepia tone on matte finish. Great for study rooms.', category: 'wall-sticker', price: 449, originalPrice: 699, stock: 38, isActive: true, isNew: false, rating: 4.8, reviewCount: 94, tags: ['map', 'world', 'vintage', 'travel'], images: ['https://placehold.co/500x500/1a1000/d4a017?text=World+Map'], variants: { stickerSizes: ['60x40cm', '90x60cm', '120x80cm'], allowCustomText: false } },
  { name: 'Feather Dream Catcher Sticker', description: 'Boho dream catcher with feathers and beads. Soft pastel tones on matte vinyl.', category: 'wall-sticker', price: 279, originalPrice: 429, stock: 72, isActive: true, isNew: false, rating: 4.6, reviewCount: 108, tags: ['dreamcatcher', 'boho', 'feather', 'spiritual'], images: ['https://placehold.co/500x500/0a0a1a/cc99ff?text=Dream+Catcher'], variants: { stickerSizes: ['30x50cm', '45x75cm', '60x100cm'], allowCustomText: false } },
  { name: 'Superhero Silhouette Sticker', description: 'Dynamic superhero cape silhouette against a city skyline. Perfect for kids and comic fans.', category: 'wall-sticker', price: 299, originalPrice: 469, stock: 65, isActive: true, isNew: true, rating: 4.7, reviewCount: 88, tags: ['superhero', 'kids', 'comic', 'silhouette'], images: ['https://placehold.co/500x500/000814/ffcc00?text=Superhero'], variants: { stickerSizes: ['30x45cm', '45x60cm', '60x90cm'], allowCustomText: false } },
  { name: 'Floral Wreath Custom Sticker', description: 'Elegant floral wreath frame. Add your family name or a quote inside. Waterproof gloss finish.', category: 'wall-sticker', price: 379, originalPrice: 579, stock: 85, isActive: true, isNew: false, rating: 4.9, reviewCount: 167, tags: ['floral', 'wreath', 'custom', 'family'], images: ['https://placehold.co/500x500/0a1a00/88ff88?text=Floral+Wreath'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: true, customTextLabel: 'Enter name or quote for center' } },
  { name: 'Ocean Wave Surf Sticker', description: 'Japanese great wave inspired ocean sticker. Deep blue and white ink on matte black.', category: 'wall-sticker', price: 329, originalPrice: 519, stock: 48, isActive: true, isNew: false, rating: 4.8, reviewCount: 115, tags: ['ocean', 'wave', 'japanese', 'surf'], images: ['https://placehold.co/500x500/000d1a/00aaff?text=Ocean+Wave'], variants: { stickerSizes: ['45x30cm', '60x40cm', '90x60cm'], allowCustomText: false } },
  { name: 'Skull Floral Gothic Sticker', description: 'Gothic skull wrapped in roses and vines. Dark aesthetic for edgy interiors.', category: 'wall-sticker', price: 349, originalPrice: 549, stock: 42, isActive: true, isNew: true, rating: 4.8, reviewCount: 79, tags: ['skull', 'gothic', 'floral', 'dark'], images: ['https://placehold.co/500x500/0a0000/ff2244?text=Skull+Floral'], variants: { stickerSizes: ['30x40cm', '45x60cm', '60x80cm'], allowCustomText: false } },
  { name: 'Solar System Planet Sticker Set', description: 'Set of 8 planet stickers with glow-in-the-dark finish. Perfect for ceilings and kids rooms.', category: 'wall-sticker', price: 499, originalPrice: 749, stock: 33, isActive: true, isNew: true, rating: 4.9, reviewCount: 143, tags: ['planets', 'space', 'kids', 'glow'], images: ['https://placehold.co/500x500/000814/aaddff?text=Solar+System'], variants: { stickerSizes: ['Small Set', 'Large Set'], allowCustomText: false } },
  { name: 'Bike Rider Silhouette Sticker', description: 'Cool motorbike rider silhouette at sunset. Great for garage walls and man caves.', category: 'wall-sticker', price: 289, originalPrice: 449, stock: 58, isActive: true, isNew: false, rating: 4.7, reviewCount: 96, tags: ['bike', 'rider', 'silhouette', 'garage'], images: ['https://placehold.co/500x500/0a0500/ff6600?text=Bike+Rider'], variants: { stickerSizes: ['45x30cm', '60x40cm', '90x60cm'], allowCustomText: false } },
  { name: 'Zen Buddha Lotus Sticker', description: 'Peaceful Buddha in lotus pose with mandala halo. Ideal for meditation rooms and yoga spaces.', category: 'wall-sticker', price: 359, originalPrice: 559, stock: 44, isActive: true, isNew: false, rating: 4.8, reviewCount: 121, tags: ['buddha', 'zen', 'lotus', 'meditation'], images: ['https://placehold.co/500x500/0a0800/ffd700?text=Zen+Buddha'], variants: { stickerSizes: ['30x40cm', '45x60cm', '60x80cm'], allowCustomText: false } },
  { name: 'Football Stadium Crowd Sticker', description: 'Roaring football stadium crowd in silhouette. Perfect for sports rooms and fan caves.', category: 'wall-sticker', price: 269, originalPrice: 419, stock: 67, isActive: true, isNew: false, rating: 4.6, reviewCount: 84, tags: ['football', 'sports', 'stadium', 'fan'], images: ['https://placehold.co/500x500/001a00/00ff44?text=Football+Stadium'], variants: { stickerSizes: ['60x30cm', '90x45cm', '120x60cm'], allowCustomText: false } },
  { name: 'Cherry Blossom Tree Sticker', description: 'Full cherry blossom tree with falling petals. Soft pink and white on matte black. Stunning bedroom art.', category: 'wall-sticker', price: 399, originalPrice: 629, stock: 39, isActive: true, isNew: true, rating: 4.9, reviewCount: 188, tags: ['cherry blossom', 'japanese', 'tree', 'pink'], images: ['https://placehold.co/500x500/0a0008/ffaacc?text=Cherry+Blossom'], variants: { stickerSizes: ['60x90cm', '90x120cm', '120x150cm'], allowCustomText: false } },
  { name: 'Music Notes Wave Sticker', description: 'Flowing music notes and treble clef in wave form. Perfect for music rooms and studios.', category: 'wall-sticker', price: 229, originalPrice: 359, stock: 78, isActive: true, isNew: false, rating: 4.6, reviewCount: 103, tags: ['music', 'notes', 'wave', 'studio'], images: ['https://placehold.co/500x500/0a0a0a/ffffff?text=Music+Notes'], variants: { stickerSizes: ['45x20cm', '60x30cm', '90x45cm'], allowCustomText: false } },
  { name: 'Abstract Neon Splash Sticker', description: 'Explosive neon paint splash in electric blue, green and pink. High-gloss finish.', category: 'wall-sticker', price: 309, originalPrice: 489, stock: 53, isActive: true, isNew: true, rating: 4.7, reviewCount: 69, tags: ['abstract', 'neon', 'splash', 'colorful'], images: ['https://placehold.co/500x500/0a0a0a/00ffcc?text=Neon+Splash'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Custom Family Tree Sticker', description: 'Personalized family tree with names on branches. Elegant black silhouette on any wall color.', category: 'wall-sticker', price: 499, originalPrice: 799, stock: 60, isActive: true, isNew: false, rating: 4.9, reviewCount: 234, tags: ['family', 'tree', 'custom', 'personalized'], images: ['https://placehold.co/500x500/0a0800/ffffff?text=Family+Tree'], variants: { stickerSizes: ['60x90cm', '90x120cm'], allowCustomText: true, customTextLabel: 'Enter family member names' } },
  { name: 'Jujutsu Kaisen Cursed Energy Sticker', description: 'Gojo and Yuji cursed energy aura wall sticker for JJK fans.', category: 'anime', price: 369, originalPrice: 579, stock: 55, isActive: true, isNew: true, rating: 4.9, reviewCount: 134, tags: ['jjk', 'anime', 'gojo'], images: ['https://cdn.myanimelist.net/images/anime/1171/109222.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Tokyo Ghoul Kaneki Mask Sticker', description: 'Ken Kaneki iconic half-mask design wall sticker.', category: 'anime', price: 339, originalPrice: 539, stock: 48, isActive: true, isNew: false, rating: 4.7, reviewCount: 98, tags: ['tokyo ghoul', 'anime', 'kaneki'], images: ['https://cdn.myanimelist.net/images/anime/5/64449.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Hunter x Hunter Killua Sticker', description: 'Killua lightning aura silhouette wall sticker for HxH fans.', category: 'anime', price: 359, originalPrice: 569, stock: 42, isActive: true, isNew: false, rating: 4.8, reviewCount: 87, tags: ['hxh', 'anime', 'killua'], images: ['https://cdn.myanimelist.net/images/anime/1337/142503.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Bleach Ichigo Bankai Sticker', description: 'Ichigo Kurosaki Bankai form wall sticker. Epic design for Bleach fans.', category: 'anime', price: 379, originalPrice: 599, stock: 38, isActive: true, isNew: false, rating: 4.8, reviewCount: 76, tags: ['bleach', 'anime', 'ichigo'], images: ['https://cdn.myanimelist.net/images/anime/3/40451.jpg'], variants: { stickerSizes: ['45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Death Note L vs Light Sticker', description: 'Iconic L and Light silhouette chess match wall sticker.', category: 'anime', price: 349, originalPrice: 549, stock: 52, isActive: true, isNew: false, rating: 4.9, reviewCount: 162, tags: ['death note', 'anime', 'light'], images: ['https://cdn.myanimelist.net/images/anime/9/9453.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Cowboy Bebop Space Jazz Sticker', description: 'Spike Spiegel retro space cowboy wall sticker. See you space cowboy.', category: 'anime', price: 329, originalPrice: 529, stock: 30, isActive: true, isNew: false, rating: 4.8, reviewCount: 71, tags: ['cowboy bebop', 'anime', 'spike'], images: ['https://cdn.myanimelist.net/images/anime/4/19644.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Evangelion Unit-01 Sticker', description: 'Neon Genesis Evangelion Unit-01 mech wall sticker. Iconic sci-fi anime art.', category: 'anime', price: 399, originalPrice: 649, stock: 28, isActive: true, isNew: false, rating: 4.8, reviewCount: 93, tags: ['evangelion', 'anime', 'mecha'], images: ['https://cdn.myanimelist.net/images/anime/1314/108941.jpg'], variants: { stickerSizes: ['45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Chainsaw Man Denji Sticker', description: 'Denji chainsaw transformation wall sticker for Chainsaw Man fans.', category: 'anime', price: 369, originalPrice: 579, stock: 45, isActive: true, isNew: true, rating: 4.9, reviewCount: 118, tags: ['chainsaw man', 'anime', 'denji'], images: ['https://cdn.myanimelist.net/images/anime/1806/126216.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Spy x Family Anya Reaction Sticker', description: 'Anya Forger cute reaction face wall sticker. Heh!', category: 'anime', price: 299, originalPrice: 479, stock: 80, isActive: true, isNew: true, rating: 4.9, reviewCount: 205, tags: ['spy x family', 'anime', 'anya'], images: ['https://cdn.myanimelist.net/images/anime/1441/122795.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Vinland Saga Thorfinn Sticker', description: 'Thorfinn warrior silhouette wall sticker from Vinland Saga.', category: 'anime', price: 359, originalPrice: 569, stock: 33, isActive: true, isNew: false, rating: 4.7, reviewCount: 64, tags: ['vinland saga', 'anime', 'thorfinn'], images: ['https://cdn.myanimelist.net/images/anime/1500/103005.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm', '90x90cm'], allowCustomText: false } },
  { name: 'Re:Zero Rem Wall Sticker', description: 'Rem in her maid outfit wall sticker. A fan favourite from Re:Zero.', category: 'anime', price: 349, originalPrice: 549, stock: 58, isActive: true, isNew: false, rating: 4.8, reviewCount: 147, tags: ['rezero', 'anime', 'rem'], images: ['https://cdn.myanimelist.net/images/anime/1522/128039.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Haikyuu!! Spike Sticker', description: 'Hinata and Kageyama quick attack wall sticker for volleyball anime fans.', category: 'anime', price: 319, originalPrice: 509, stock: 62, isActive: true, isNew: false, rating: 4.7, reviewCount: 109, tags: ['haikyuu', 'anime', 'volleyball'], images: ['https://cdn.myanimelist.net/images/anime/7/76014.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
  { name: 'Steins;Gate Okabe Lab Sticker', description: 'El Psy Kongroo! Okabe Rintaro mad scientist wall sticker.', category: 'anime', price: 349, originalPrice: 549, stock: 36, isActive: true, isNew: false, rating: 4.8, reviewCount: 82, tags: ['steins gate', 'anime', 'okabe'], images: ['https://cdn.myanimelist.net/images/anime/5/73199.jpg'], variants: { stickerSizes: ['30x30cm', '45x45cm', '60x60cm'], allowCustomText: false } },
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