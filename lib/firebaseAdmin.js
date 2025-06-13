import admin from 'firebase-admin'

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
    })
}

const db = admin.firestore()
const adminAuth = admin.auth()
const FieldValue = admin.firestore.FieldValue

export { db, adminAuth, FieldValue }
