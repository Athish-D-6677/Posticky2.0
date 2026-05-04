const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const ADMIN_UID = 'QDhcnJZyioYtj6uGyWodtjoLUuG2'

async function run() {
  await admin.auth().setCustomUserClaims(ADMIN_UID, { admin: true })
  console.log('✅ Admin claim SET for UID:', ADMIN_UID)

  const user = await admin.auth().getUser(ADMIN_UID)
  console.log('✅ Verified claims:', JSON.stringify(user.customClaims))
  console.log('✅ Email:', user.email)
  console.log('\nDone! Now sign out and sign back in at /admin/login')
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
