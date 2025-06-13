import { db, FieldValue } from '@/lib/firebaseAdmin'
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

    const token = authHeader.split(' ')[1]
    let decoded
    try {
        decoded = verifyToken(token)
    } catch {
        return res.status(400).json({ error: 'Invalid token' })
    }

    const { invite_id, status } = req.body
    const memberEmail = decoded.email

    if (!invite_id || !memberEmail || !['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ error: 'Missing or invalid fields' })
    }

    try {
        const inviteRef = db.collection('invitations').doc(invite_id)
        const inviteSnap = await inviteRef.get()

        if (!inviteSnap.exists) {
            return res.status(404).json({ error: 'Invitation not found' })
        }

        const inviteData = inviteSnap.data()
        const boardId = inviteData.boardId

        if (inviteData.memberEmail !== memberEmail) {
        return res.status(403).json({ error: 'Unauthorized to accept this invitation' })
        }

        await inviteRef.update({
            status,
            respondedAt: new Date().toISOString(),
        })

        if (status === 'accepted') {
            const boardRef = db.collection('boards').doc(boardId)
            // add vào members
            await boardRef.update({
                members: FieldValue.arrayUnion(memberEmail),
            })
        }

        return res.status(200).json({ success: true, message: `Invitation ${status}` })
    } catch (error) {
        console.error('Error updating invitation:', error)
        return res.status(500).json({ error: 'Failed to update invitation' })
    }
}
