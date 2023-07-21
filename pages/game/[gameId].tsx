import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import useUserId from '../../hooks/useUserId';
import axios from 'axios';
import '/app/globals.css'
import QueueScreen from './queueScreen';
import RoleScreen from './roleScreen';
import { GameData } from '../../types/gameTypes';

const GamePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [data, setData] = useState<GameData | undefined>(undefined);
  const userId = useUserId();
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [webSocket, setWebsocket] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    if (gameId && userId) {
      const webSocket = new WebSocket('wss://dndtower.com:443');

      webSocket.onopen = () => {
        webSocket.send(JSON.stringify({ gameId, userId }));
      };

      webSocket.onmessage = (event) => {
        setData(JSON.parse(event.data));
      };

      webSocket.onclose = () => { /* Nothing yet */ };

      webSocket.onerror = (error) => { console.log(error); /* Nothing yet */ };

      setWebsocket(webSocket);

      return () => { webSocket.close(); };
    }
  }, [gameId, userId]);

  return (
    <>
      { data && data['playerCount'] && <QueueScreen gameId={gameId} data={data} webSocket={webSocket} /> }
      { data && data['role'] && <RoleScreen data={data} /> }
    </>
  );
};

export default GamePage;