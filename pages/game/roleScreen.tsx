import React, { useEffect, useRef, useState } from 'react';
import useUserId from '../../hooks/useUserId';
import '/app/globals.css'

type GameData = {
  gameId: string;
  playerCount: number;
}

interface RoleProps {
  data: GameData;
}

const RoleScreen: React.FC<RoleProps> = ({ data }) => {
  const userId = useUserId();

  return (
    <>
      <div className='roleScreen'>
        {data.ability}
      </div>
    </>
  );
};

export default RoleScreen;