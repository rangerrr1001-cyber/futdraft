import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('✓ Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMatch(matchId: string): void {
    if (this.socket) {
      this.socket.emit('join_match', matchId);
    }
  }

  onMatchEvent(callback: (event: any) => void): void {
    if (this.socket) {
      this.socket.on('match_event', callback);
    }
  }

  onScoreUpdate(callback: (score: any) => void): void {
    if (this.socket) {
      this.socket.on('score_update', callback);
    }
  }

  onMatchEnd(callback: (result: any) => void): void {
    if (this.socket) {
      this.socket.on('match_end', callback);
    }
  }

  offMatchEvent(): void {
    if (this.socket) {
      this.socket.off('match_event');
    }
  }

  offScoreUpdate(): void {
    if (this.socket) {
      this.socket.off('score_update');
    }
  }

  offMatchEnd(): void {
    if (this.socket) {
      this.socket.off('match_end');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
