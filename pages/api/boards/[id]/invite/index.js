import { db } from '@/lib/firebaseAdmin'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const JWT_SECRET = process.env.JWT_SECRET || 'test_mini_trello'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid token')
  }
}

async function sendInviteEmail(email, inviteLink, ownerEmail) {
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
      from: `"Mini Trello" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Lời mời tham gia Board',
      text: `Bạn được mời tham gia board bởi ${ownerEmail}. Nhấn vào link để nhận lời mời: ${inviteLink}`,
      html: `
        <p>Xin chào,</p>
        <p>Bạn được <b>${ownerEmail}</b> mời tham gia một board.</p>
        <p>Nhấn vào <a href="${inviteLink}">đây</a> để nhận lời mời.</p>
        <p>Nếu bạn không muốn tham gia, vui lòng bỏ qua email này.</p>
      `,
    })

    console.log(`Gửi mail lời mời tới ${email} thành công.`)
  } catch (error) {
    console.error('Lỗi khi gửi mail lời mời:', error)
    throw new Error('Không thể gửi email lời mời')
  }
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]
  let decoded
  try {
    decoded = verifyToken(token)
    
  } catch {
    return res.status(400).json({ error: 'Invalid token' })
  }

  const boardId = req.query.id
  const { memberEmail = '', status = 'pending', domain } = req.body
  const ownerEmail = decoded.email
  if (!ownerEmail || !memberEmail) {
    return res.status(400).json({ error: 'Missing required fields: ownerEmail, memberEmail' })
  }

  try {
    const inviteRef = await db.collection('invitations').add({
      boardId,
      ownerEmail,
      memberEmail,
      status,
      createdAt: new Date().toISOString(),
    })
    const acceptLink = `${domain}/invitations/accept?invite_id=${inviteRef.id}`
    
    await sendInviteEmail(memberEmail, acceptLink, ownerEmail)
    return res.status(200).json({ success: true, invite_id: inviteRef.id })
  } catch (error) {
    console.error('Error sending invitation:', error)
    return res.status(500).json({ error: 'Failed to send invitation' })
  }
}
