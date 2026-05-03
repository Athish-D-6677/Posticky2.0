import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyADyGJIFevRJ8ufqwq9aGxZW82H7TBmssE",
  authDomain: "posticky-84758.firebaseapp.com",
  projectId: "posticky-84758",
  storageBucket: "posticky-84758.firebasestorage.app",
  messagingSenderId: "641261565855",
  appId: "1:641261565855:web:f368032910c23118d82faa",
  measurementId: "G-DKLC7Y5GJP"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
