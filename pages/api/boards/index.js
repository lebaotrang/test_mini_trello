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

async function retrieveAllBoards(email, res) {
  const data = await db
    .collection('boards')
    .where('members', 'array-contains', email)
    .orderBy('createdAt', 'desc')
    .get()

  const boards = data.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
  }))

  return res.status(200).json(boards)
}

export async function createNewBoard(email, body, res) {
  const { name, description } = body
  if (!name || !description) {
    return res.status(400).json({ error: 'Missing name or description' })
  }

  try {
    const boardRef = await db.collection('boards').add({
      name,
      description,
      ownerEmail: email,
      members: [email],
      createdAt: new Date().toISOString(),
    })

    const userRef = db.collection('users').doc(email)
    await userRef.update({
      boards: FieldValue.arrayUnion(boardRef.id),
    })

    return res.status(201).json({
      id: boardRef.id,
      name,
      description,
    })
  } catch (err) {
    console.error('Error creating board:', err)
    return res.status(500).json({ error: 'Failed to create board' })
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

  switch (req.method) {
    case 'GET':
      return await retrieveAllBoards(email, res)

    case 'POST':
      return await createNewBoard(email, req.body, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
