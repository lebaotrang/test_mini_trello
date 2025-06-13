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
  
  const { id: boardId, cardId } = req.query

  if (!cardId) {
    return res.status(400).json({ error: 'Missing cardId' })
  }

  if (!boardId) {
    return res.status(400).json({ error: 'Missing boardId' })
  }

  switch (req.method) {
    case 'GET':
      return await getTasks(cardId, res)

    case 'POST':
      return await createTask(cardId, req, res)

    case 'PATCH':
      return await reorderTasks(cardId, req, res)

    default:
      return res.status(405).json({ error: 'Method Not Allowed' })
  }
}

async function getTasks(cardId, res) {
  const snapshot = await db.collection('cards').doc(cardId).collection('tasks').orderBy('order', 'asc').get()

  const tasks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return res.status(200).json(tasks)
}

// Tạo task mới trong card
async function createTask(cardId, req, res) {
  const { title, done = false, description = '' } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing task title' });
  }

  const tasksSnapshot = await db
    .collection('cards')
    .doc(cardId)
    .collection('tasks')
    .get();
  const order = tasksSnapshot.size;

  const newTask = {
    title,
    description,
    done,
    order,
    createdAt: new Date().toISOString(),
    members: [],
  };

  const taskRef = await db
    .collection('cards')
    .doc(cardId)
    .collection('tasks')
    .add(newTask);

  const createdTask = {
    id: taskRef.id,
    ...newTask,
  };

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('taskCreated', {
      cardId,
      task: createdTask,
    });
  }

  return res.status(201).json(createdTask);
}


async function reorderTasks(cardId, req, res) {
  const { tasks } = req.body

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'tasks must be an array' })
  }

  const batch = db.batch()
  tasks.forEach((taskId, index) => {
    const taskRef = db.collection('cards').doc(cardId).collection('tasks').doc(taskId)
    batch.update(taskRef, { order: index })
  })

  await batch.commit()

  const io = req?.socket?.server?.io;
  if (io) {
    io.emit('tasksReordered', {
      cardId,
      tasksOrder: tasks,
    });
  }

  return res.status(200).json({ message: 'Task order updated' })
}
