import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const GameQueuePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/game?id=${gameId}`);
        const data = await response.text();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch initial data
    fetchData();

    // Poll for updates every second
    const interval = setInterval(fetchData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameId]);

  return (
    <div>
      <h1>Treachery</h1>
      <p>Game Id: {gameId}</p>
      <p>Current Player Count: {data}</p>
    </div>
  );
};

export default GameQueuePage;