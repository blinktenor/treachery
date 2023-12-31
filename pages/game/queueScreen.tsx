import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import useUserId from '../../hooks/useUserId';
import axios from 'axios';
import '/app/globals.css'
import { GameData } from '../../types/gameTypes';

interface QueueProps {
  gameId?: string | string[];
  data: GameData;
  webSocket?: WebSocket;
}

const QueueScreen: React.FC<QueueProps> = ({ gameId, data, webSocket }) => {
  const qrCodeRef = useRef<HTMLCanvasElement | null>(null);
  const userId = useUserId();
  const gameStart = data && data.host && data.playerCount && data.playerCount > 3 && data.playerCount < 9;

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
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const startGame = () => {
    webSocket?.send(JSON.stringify({ gameId, userId, startGame: true }));
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
        </div>
      </div>
    </>
  );
};

export default QueueScreen;