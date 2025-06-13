import { db } from '@/lib/firebaseAdmin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'test_mini_trello'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    throw new Error('Invalid token')
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

  let decoded
  try {
    const token = authHeader.split(' ')[1]
    decoded = verifyToken(token)
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { invite_id, card_id, member_id, status } = req.body

  if (!invite_id || !card_id || !member_id || !['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'Missing or invalid invite_id, card_id, member_id or status' })
  }

  try {
    // Cập nhật trạng thái lời mời
    const inviteRef = db.collection('invitations').doc(invite_id)
    const inviteSnap = await inviteRef.get()

    if (!inviteSnap.exists) {
      return res.status(404).json({ error: 'Invitation not found' })
    }

    await inviteRef.update({ status })

    if (status === 'accepted') {
      // Thêm member vào card nếu chưa có
      const cardRef = db.collection('cards').doc(card_id)
      await cardRef.update({
        members: db.FieldValue.arrayUnion(member_id),
      })
    }

    return res.status(200).json({ success: true, message: `Invitation ${status}` })
  } catch (error) {
    console.error('Error processing invitation:', error)
    return res.status(500).json({ error: 'Failed to process invitation' })
  }
}
