const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

async function updateSizes() {
  const snap = await db.collection('products').where('category', '==', 'tshirt').get()
  const batch = db.batch()
  snap.docs.forEach(doc => {
    batch.update(doc.ref, { 'variants.sizes': ['Oversize'] })
  })
  await batch.commit()
  console.log(`✅ Updated ${snap.docs.length} t-shirts — Oversize only in Firestore`)
}

updateSizes()
