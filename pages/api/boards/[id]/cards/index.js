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

  const snapshot = await db
    .collection('cards')
    .where('boardId', '==', boardId)
    .orderBy('order', 'asc')
    .get()

  // Lấy kèm tasks cho từng card
  const cardsWithTasks = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const cardId = doc.id
      const cardData = doc.data()

      const taskSnapshot = await db
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .orderBy('order', 'asc')
        .get()

      const tasks = taskSnapshot.docs.map(taskDoc => ({
        id: taskDoc.id,
        ...taskDoc.data()
      }))

      return {
        id: cardId,
        ...cardData,
        tasks,
      }
    })
  )

  return res.status(200).json(cardsWithTasks)
}

async function retrieveCardDetail(id, res) {
  const doc = await db.collection('cards').doc(id).get()
  if (!doc.exists) return res.status(404).json({ error: 'Card not found' })

  const data = doc.data()
  return res.status(200).json({
    id: doc.id,
    name: data.name,
    description: data.description,
    boardId: data.boardId,
    order: data.order
  })
}

async function createNewCard(req, res) {
  const { name, description, boardId } = req.body
  if (!name || !description || !boardId) {
    return res.status(400).json({ error: 'Missing name, description, or boardId' })
  }

  const cards = await db
    .collection('cards')
    .where('boardId', '==', boardId)
    .get()

  const order = cards.size

  const cardRef = await db.collection('cards').add({
    name,
    description,
    boardId,
    order,
    createdAt: new Date().toISOString(),
    tasks: []
  })
  
  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('cardCreated', {
      id: cardRef.id,
      name,
      description,
      boardId,
      order,
      tasks: []
    });
  }

  return res.status(201).json({
    id: cardRef.id,
    name,
    description,
    boardId,
    order
  })
}

async function updateCardDetail(id, body, res) {
  const docRef = db.collection('cards').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return res.status(404).json({ error: 'Card not found' })

  const { name, description } = body
  if (!name && !description) return res.status(400).json({ error: 'Nothing to update' })

  const updateData = {}
  if (name) updateData.name = name
  if (description) updateData.description = description

  await docRef.update(updateData)

  return res.status(200).json({
    id,
    ...updateData,
  })
}

async function deleteCard(id, res) {
  const docRef = db.collection('cards').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return res.status(404).json({ error: 'Card not found' })

  await docRef.delete()
  return res.status(200).json({ message: 'Card deleted' })
}

async function reorderCards(req, res) {
  const { cards } = req.body;
  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: 'cards must be an array' });
  }

  const batch = db.batch();
  cards.forEach((cardId, index) => {
    const ref = db.collection('cards').doc(cardId);
    batch.update(ref, { order: index });
  });

  await batch.commit();

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('cardsReordered', {
      cardsOrder: cards,
    });
  }

  return res.status(200).json({ message: 'Card order updated' });
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    verifyToken(token)
  } catch {
    return res.status(401).json({ error: 'Unauthorized or invalid token' })
  }

  const { id:boardId, cardId } = req.query

  switch (req.method) {
    case 'GET':
      if (boardId) {
        return await retrieveAllCards(boardId, res)
      } else if (cardId) {
        return await retrieveCardDetail(cardId, res)
      }
      return res.status(400).json({ error: 'Missing boardId or cardId' })

    case 'POST':
      return await createNewCard(req, res)

    case 'PUT':
      if (!cardId) return res.status(400).json({ error: 'Missing cardId in query' })
      return await updateCardDetail(cardId, req.body, res)

    case 'PATCH':
      return await reorderCards(req, res)
      // {
      //   const { cards } = req.body
      //   if (!Array.isArray(cards)) {
      //     return res.status(400).json({ error: 'cards must be an array' })
      //   }

      //   const batch = db.batch()
      //   cards.forEach((cardId, index) => {
      //     const ref = db.collection('cards').doc(cardId)
      //     batch.update(ref, { order: index })
      //   })

      //   await batch.commit()
      //   return res.status(200).json({ message: 'Card order updated' })
      // }

    case 'DELETE':
      if (!cardId) return res.status(400).json({ error: 'Missing cardId in query' })
      return await deleteCard(cardId, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
