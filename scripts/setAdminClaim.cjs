const admin = require("firebase-admin");

// path to your downloaded JSON
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "97S63PCvYgUdXwphn7fE00gIdeS2"; // from Firebase console

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("✅ Admin role assigned");
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });