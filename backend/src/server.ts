import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './index';
import { setupSocketServer } from './socket/socketHandler';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});

// Setup Socket.IO handlers
setupSocketServer(io);

// Start server
httpServer.listen(PORT, () => {
  console.log('=========================================');
  console.log('🚀 FUT Draft Server Started');
  console.log('=========================================');
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log('=========================================');
});

export default httpServer;
