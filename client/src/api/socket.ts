import { Client } from '../../../node_modules/@types/pg';
import { WebSocketClient } from './websocket';
import { io } form "socket.io-Client";

const socket = io(import.meta.env.VITE_SEVER_URL);
export default socket