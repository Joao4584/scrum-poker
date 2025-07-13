'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

const url = process.env.BACKEND_URL + '/lobby'; // Certifique-se de usar NEXT_PUBLIC_

export default function Page() {
  const params = useParams();
  const lobbyId = params?.lobbyId as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!lobbyId) return;

    const newSocket = io(url, {
      transports: ['websocket'], // Garante que usa apenas WebSockets
      query: {
        userId: '123', // Substitua pelo ID real do usuário
        lobbyUuid: lobbyId,
      },
      host: 'dwadwa',
    });

    newSocket.on('connect', () => {
      console.log('Conectado ao WebSocket');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado do WebSocket');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [lobbyId]);

  return (
    <div className="a">
      <h1>Landing - Lobby ID: {lobbyId}</h1>
      <p>Status: {connected ? 'Conectado' : 'Desconectado'}</p>
    </div>
  );
}
