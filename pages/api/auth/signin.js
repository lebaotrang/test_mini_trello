import { db } from '@/lib/firebaseAdmin'
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'test_mini_trello'

// send mail
async function sendVerificationEmail(email, code) {
  console.log(`✅ Send code ${code} to ${email}`)
  //...
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, verificationCode } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })
  if (!verificationCode) return res.status(400).json({ error: 'Code is required' })

  const userRef = db.collection('users').doc(email)
  const userDoc = await userRef.get()


  if (!userDoc.exists) return res.status(400).json({ error: 'User not found' })
  const userData = userDoc.data()

  // if (userData.verified) {
  //   return res.status(400).json({ error: 'User already verified' })
  // }

  if (userData.code !== verificationCode) {
    return res.status(401).json({ error: 'Invalid verification code' })
  }

  // if (user.verificationCodeExpiresAt && Date.now() > user.verificationCodeExpiresAt) {
  //     return res.status(410).json({ error: 'Verification code expired' })
  //   }

  // ud
  await userRef.update({
    verified: true,
    verificationCode: null,
    verifiedAt: new Date().toISOString(),
    boards: [],
  })

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })

  return res.status(201).json({
    id: userRef.id,
    email,
    accessToken: token
  })

}
