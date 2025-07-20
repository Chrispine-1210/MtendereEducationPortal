import { Server as SocketIOServer } from 'socket.io';

export function initWebSocket(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  });
}
