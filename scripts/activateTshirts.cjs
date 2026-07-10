const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

async function activateDemoTshirts() {
  const snap = await db.collection('products')
    .where('category', '==', 'tshirt')
    .get()

  if (snap.empty) { console.log('No inactive tshirts found'); return }


  
  const docs = snap.docs
  console.log(`Found ${docs.length} inactive t-shirts`)

  // Activate ALL of them as demo products with isActive: true
  const batch = db.batch()
  docs.forEach((doc, i) => {
    batch.update(doc.ref, {
      isActive: true,
      name: `Streetwear Tee #${i + 1}`,
      description: 'Premium 100% cotton oversized streetwear t-shirt. Unisex fit. Pre-shrunk fabric. Soft & breathable.',
      price: 499,
      originalPrice: 799,
      stock: 50,
      theme: 'aesthetic',
      tags: ['tshirt', 'streetwear', 'oversized', 'aesthetic'],
    })
  })

  await batch.commit()
  console.log(`✅ Activated ${docs.length} t-shirts as demo products!`)
}

activateDemoTshirts()
