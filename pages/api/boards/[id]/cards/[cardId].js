import { db } from '@/lib/firebaseAdmin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'test_mini_trello'

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid token')
  }
}

async function retrieveAllCards(boardId, res) {
  if (!boardId) {
    return res.status(400).json({ error: 'Missing boardId' })
  }
  console.log(boardId)

  const snapshot = await db
    .collection('cards')
    .where('boardId', '==', boardId)
    .get()

  const cards = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
    boardId: doc.data().boardId,
  }))

  return res.status(200).json(cards)
}

async function retrieveCardDetail(id, res) {
  const doc = await db.collection('cards').doc(id).get()
  if (!doc.exists) return res.status(404).json({ error: 'Card not found' })

  const data = doc.data()
  return res.status(200).json({
    id: doc.id,
    title: data.title,
    description: data.description,
    boardId: data.boardId,
  })
}

async function updateCardDetail(id, req, res) {

  const docRef = db.collection('cards').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return res.status(404).json({ error: 'Card not found' })

  const data = doc.data()

  const { name, description } = req.body
  if (!name && !description) return res.status(400).json({ error: 'Nothing to update' })

  const updateData = {}
  if (name) updateData.name = name
  if (description) updateData.description = description

  await docRef.update(updateData)

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('cardUpdated', {
      id,
      ...updateData,
    });
  }

  return res.status(200).json({
    id,
    ...updateData,
  })
}

async function deleteCard(req, res) {
  const { cardId } = req.query;
  const docRef = db.collection('cards').doc(cardId);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).json({ error: 'Card not found' });

  await docRef.delete();

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('cardDeleted', { cardId });
  }

  return res.status(200).json({ message: 'Card deleted', cardId });
}


export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    verifyToken(token)
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized or invalid token' })
  }

  const { id: boardId, cardId } = req.query

  switch (req.method) {
    case 'GET':
      if (!cardId) {
        return res.status(400).json({ error: 'Missing card id' })
      }
      return await retrieveCardDetail(cardId, res)

    case 'PUT':
      if (!cardId) {
        return res.status(400).json({ error: 'Missing card id' })
      }
      return await updateCardDetail(cardId, req, res)

    case 'DELETE':
      if (!cardId) {
        return res.status(400).json({ error: 'Missing card id' })
      }
      return await deleteCard(req, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
