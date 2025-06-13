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
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    verifyToken(token)
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
  
  const { id: boardId, cardId, taskId } = req.query

  if (!cardId) {
    return res.status(400).json({ error: 'Missing cardId' })
  }

  if (!boardId) {
    return res.status(400).json({ error: 'Missing boardId' })
  }

  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' })
  }

  switch (req.method) {
    case 'GET':
      return await getTaskDetail(cardId, taskId, res)

    case 'PUT':
      return await updateTask(cardId, taskId, req, res)

    case 'DELETE':
      return await deleteTask(cardId, taskId, req, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}

async function getTaskDetail(cardId, taskId, res) {
  const doc = await db.collection('cards').doc(cardId).collection('tasks').doc(taskId).get()
  if (!doc.exists) return res.status(404).json({ error: 'Task not found' })

  return res.status(200).json({
    id: doc.id,
    ...doc.data()
  })
}

async function updateTask(cardId, taskId, req, res) {
  const docRef = db.collection('cards').doc(cardId).collection('tasks').doc(taskId);
  const doc = await docRef.get();
  if (!doc.exists) return res.status(404).json({ error: 'Task not found' });

  const body = req.body
  const updateData = {};

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.done !== undefined) updateData.done = body.done;

  if (Array.isArray(body.members)) {
    updateData.members = body.members;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  await docRef.update(updateData);
  const updatedDoc = await docRef.get();

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('taskUpdated', {
      cardId,
      task: { id: taskId, ...updatedDoc.data() }
    });
  }

  return res.status(200).json({ id: taskId, ...updatedDoc.data() });
}

async function deleteTask(cardId, taskId, req, res) {
  const docRef = db.collection('cards').doc(cardId).collection('tasks').doc(taskId)
  const doc = await docRef.get()
  if (!doc.exists) return res.status(404).json({ error: 'Task not found' })

  await docRef.delete()

  const io = req?.socket?.server?.io
  if (io) {
    io.emit('taskDeleted', { cardId, taskId })
  }

  return res.status(200).json({ message: 'Task deleted successfully' })
}

