import { Server as SocketServer, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';

interface SocketWithUser extends Socket {
  userId?: string;
}

export function setupSocketServer(io: SocketServer): void {
  // Authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = verifyToken(token);
      (socket as SocketWithUser).userId = payload.user_id;
      next();
    } catch (error) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userSocket = socket as SocketWithUser;
    console.log('✓ User connected via WebSocket:', userSocket.userId);

    // Join match room
    socket.on('join_match', (matchId: string) => {
      const roomId = `match_${matchId}`;
      socket.join(roomId);
      console.log(`User ${userSocket.userId} joined room ${roomId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', userSocket.userId);
    });
  });
}
