import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import useUserId from '/hooks/useUserId';

const GameQueuePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [data, setData] = useState<string>('');
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const userId = useUserId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/game?gameId=${gameId}&userId=${userId}`);
        const data = await response.text();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch initial data
    fetchData();

    // Poll for updates every second
    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [gameId]);

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

  return (
    <div>
      <h1>Treachery</h1>
      <p>Game Id: {gameId}</p>
      <p>Current Player Count: {data}</p>
      <canvas ref={qrCodeRef} />
    </div>
  );
};

export default GameQueuePage;