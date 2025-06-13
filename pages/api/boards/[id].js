import { db, FieldValue } from '@/lib/firebaseAdmin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'test_mini_trello'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid token')
  }
}

async function retrieveBoardDetail(id, email, res) {
  try {
    const docRef = db.collection('boards').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Board not found' })
    }

    const data = docSnap.data()

    if (!data.members.includes(email)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    return res.status(200).json({
      id: docSnap.id,
      name: data.name,
      description: data.description,
      members: data.members,
      ownerEmail: data.ownerEmail
    })
  } catch (error) {
    console.error('Error retrieving board detail:', error)
    return res.status(500).json({ error: 'Failed to retrieve board' })
  }
}

async function updateBoardDetail(id, body, email, res) {
  try {
    const docRef = db.collection('boards').doc(id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Board not found' })
    }

    const boardData = snapshot.data()

    if (boardData.ownerEmail !== email) {
      return res.status(403).json({ error: 'You are not the owner of this board' })
    }

    const { name, description } = body

    if (!name && !description) {
      return res.status(400).json({ error: 'Missing name & description' })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (description) updateData.description = description

    await docRef.update(updateData)

    return res.status(200).json({
      id,
      ...updateData,
    })
  } catch (error) {
    console.error('Error updating board:', error)
    return res.status(500).json({ error: 'Failed to update board' })
  }
}

async function deleteBoard(id, email, res) {
  try {
    const docRef = db.collection('boards').doc(id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Board not found' })
    }

    const boardData = snapshot.data()

    if (boardData.ownerEmail !== email) {
      return res.status(403).json({ error: 'You are not the owner of this board' })
    }

    await docRef.delete()

    const userRef = db.collection('users').doc(email)
    await userRef.update({
      boards: FieldValue.arrayRemove(id),
    })

    return res.status(200).json({ message: 'Board deleted' })
  } catch (error) {
    console.error('Error deleting board:', error)
    return res.status(500).json({ error: 'Failed to delete board' })
  }
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]
  let decoded

  try {
    decoded = verifyToken(token)
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized or invalid token' })
  }

  const email = decoded.email
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      return await retrieveBoardDetail(id, email, res)

    case 'PUT':
      return await updateBoardDetail(id, req.body, email, res)

    case 'DELETE':
      return await deleteBoard(id, email, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
