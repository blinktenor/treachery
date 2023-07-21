import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import useUserId from '../../hooks/useUserId';
import axios from 'axios';
import '/app/globals.css'

type GameData = {
  gameId: string;
  playerCount: number;
}

const GameQueuePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [data, setData] = useState<GameData | undefined>(undefined);
  const qrCodeRef = useRef<HTMLCanvasElement | null>(null);
  const userId = useUserId();
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [webSocket, setWebsocket] = useState<WebSocket>(undefined);

  useEffect(() => {
    if (gameId && userId) {
      const webSocket = new WebSocket('wss://localhost:888');

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

  useEffect(() => {
    const generateQRCode = async () => {
      if (qrCodeRef.current) {
        const currentUrl = window.location.href;
        try {
          await QRCode.toCanvas(qrCodeRef.current, currentUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, []);

  useEffect(() => {
    if (data && data['playerCount'] > 0 && data['host']) {
      setGameStart(true);
    }
    if (data && data['role']) {
      console.log(data);
    }
  }, [data]);

  const copyQRCode = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.toBlob((blob) => {
        if (blob) {
          const data = [new ClipboardItem({ 'image/png': blob })];
          navigator.clipboard.write(data as ClipboardItems);
        }
      });
    }
  };

  const copyGameUrl = () => {
    navigator.clipboard.write(window.location.href as any as ClipboardItems);
  };

  const handleShareToDiscord = () => {
    const url = window.location.href;
    const discordShareUrl = `https://discord.com/api/share?url=${encodeURIComponent(url)}`;

    window.open(discordShareUrl, '_blank');
  };

  const startGame = () => {
    webSocket.send(JSON.stringify({ gameId, userId, startGame: true }));
  }

  return (
    <>
      <div className='queueScreen'>
        <h1>Treachery</h1>
        <p>Game Id: {gameId}</p>
        <p>Current Player Count: {data?.playerCount}</p>
        {gameStart && (
          <div>
            <button onClick={startGame} > Start Game! </button>
          </div>
        )}
        <div className='copyContainer'>
          <canvas ref={qrCodeRef} />
          <button onClick={copyQRCode}> Copy QR Code </button>
          <button onClick={copyGameUrl}> Copy Game URL </button>
          <button onClick={handleShareToDiscord}> Share to Discord </button>
        </div>
      </div>
    </>
  );
};

export default GameQueuePage;