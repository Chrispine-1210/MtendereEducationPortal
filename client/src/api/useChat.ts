import { useEffect } from 'react';
import socket from '@/api/socket';
import { SocketAddress } from 'net';

const useChat = () => {
    useEffect (() => {
        socket.on("message", (msg) => {
            console.log("Recieve: ", msg );
        });
        return () => {
            socket.off("message");
        };
    }, 
    []);

    const sendMessage = (msg: string) => {
        SocketAddress.emit("message", msg);
    };

    return { sendMessage }
};

export default useChat;