import { Server } from 'socket.io';

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('🔌 New client connected');

    // Join room
    socket.on('joinBoard', (boardId) => {
      socket.join(boardId);
      console.log(`Client joined board ${boardId}`);
    });

    // Leave room
    socket.on('leaveBoard', (boardId) => {
      socket.leave(boardId);
      console.log(`Client left board ${boardId}`);
    });

    // Broadcast task updates to the same board
    socket.on('taskUpdated', ({ boardId, task }) => {
      socket.to(boardId).emit('taskUpdated', task);
    });

    socket.on('taskDeleted', ({ boardId, taskId }) => {
      socket.to(boardId).emit('taskDeleted', taskId);
    });

    socket.on('taskCreated', ({ boardId, task }) => {
      socket.to(boardId).emit('taskCreated', task);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnect');
    });
  });

  res.end();
}
