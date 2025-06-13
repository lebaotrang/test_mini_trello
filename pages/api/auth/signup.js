import { db } from '@/lib/firebaseAdmin'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

async function sendVerificationEmail(email, code) {
  

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: '"Xác Thực Tài Khoản" <no-reply@yourdomain.com>',
      to: email,
      subject: 'Mã xác thực của bạn',
      text: `Mã xác thực của bạn là: ${code}`,
      html: `<p>Mã xác thực của bạn là: <b>${code}</b></p>`,
    })

    console.log(`Gửi mail tới ${email} với mã xác thực: ${code}`)
  } catch (error) {
    console.error('Lỗi khi gửi mail:', error)
    throw new Error('Không thể gửi email')
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const code = randomBytes(3).toString('hex')
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 ph

    await db.collection('users').doc(email).set({
      code,
      createdAt: new Date().toISOString(),
      expiresAt,
    })

    await sendVerificationEmail(email, code)

    return res.status(200).json({ message: 'Verification code sent to email' })
  } catch (error) {
    console.error('API /auth/send-code error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

