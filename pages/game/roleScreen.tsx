import React, { useEffect, useRef, useState } from 'react';
import useUserId from '../../hooks/useUserId';
import '/app/globals.css'
import { GameData } from '../../types/gameTypes';

interface RoleProps {
  data: GameData;
}

const RoleScreen: React.FC<RoleProps> = ({ data }) => {
  const userId = useUserId();

  if (!data) {
    return (<></>);
  }

  return (
    <>
      <div className='roleScreen'>
        {data.ability}
      </div>
    </>
  );
};

export default RoleScreen;