'use client'
import Image from 'next/image'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserId from '../hooks/useUserId';

const Home: React.FC = () => {
  const router = useRouter();
  const userId = useUserId();
  const [gameInputValue, setGameInputValue] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInputValue(e.target.value);
  };

  const startGame = () => {
    // Generate random 8-digit ID
    const gameId = Math.floor(Math.random() * 100000000);

    // Redirect to /queue/<id>
    router.push(`/game/${gameId}`);
  };

  const joinGame = () => {
    const gameIdInput = gameInputValue.trim();

    if (gameIdInput && gameIdInput.length === 8) {
      router.push(`/game/${gameIdInput}`);
    } else {
      setErrorCode('Game id must be 8 characters');
    }
  };

  useEffect(() => {
    const images = ['home1.jpg', 'home2.jpg', 'home3.jpg'];
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    setBackgroundImage(selectedImage);
  }, []);

  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };
  
  return (
    <div style={divStyle} className='homescreen'>
      <h1>Treachery</h1>
      <div className='newGame'>
        <button onClick={startGame}>Start a Game</button>
      </div>
      <div className='loadGame'>
        <input type="text" value={gameInputValue} onChange={handleInputChange} placeholder="Enter game ID" />
        <button onClick={joinGame}>Join A Game</button>
        <div id='errorCode'> {errorCode} </div>
      </div>
      <div className='learnMoreLink'>
        <a href="https://mtgtreachery.net/en/" target="_blank" rel="noopener noreferrer">Learn more about the game</a>
      </div>
    </div>
  );
};

export default Home;
