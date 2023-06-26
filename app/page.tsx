'use client'
import Image from 'next/image'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserId from '/hooks/useUserId';

const Home: React.FC = () => {
  const router = useRouter();
  const userId = useUserId();

  const startGame = () => {
    // Generate random 8-digit ID
    const gameId = Math.floor(Math.random() * 100000000);

    // Redirect to /queue/<id>
    router.push(`/queue/${gameId}`);
  };

  return (
    <div>
      <h1>Treachery</h1>
      <button onClick={startGame}>Start a Game</button>
    </div>
  );
};

export default Home;
