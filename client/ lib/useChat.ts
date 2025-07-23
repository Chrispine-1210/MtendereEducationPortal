import { useEffect } from 'react';
import socket from './socket';

const useChat = () => {
    useEffect {
        socket.on("message", (msg){
            console.log("Recieve: " Z)
        } ) 
    }
}