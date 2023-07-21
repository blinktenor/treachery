import React, { useEffect, useRef, useState } from 'react';
import useUserId from '../../hooks/useUserId';
import '/app/globals.css'

type GameData = {
  ability: string;
  playerId: string;
  role: string;
  title: string;
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