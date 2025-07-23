import { Client } from './../../node_modules/@types/pg/index.d';
import { WebSocketClient } from './../src/lib/websocket';
import { io } form "socket.io-Client";

const socket socket = io(import.meta.env.VITE_SEVER_URL);
export default socket