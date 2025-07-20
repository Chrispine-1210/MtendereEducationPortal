import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export function initWebSocket(server: HTTPServer) {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*", // adjust for production domains
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}
