import React from 'react';
import useUserId from '../../hooks/useUserId';
import '/app/globals.css'
import { GameData } from '../../types/gameTypes';

interface RoleProps {
  data: GameData;
}

const RoleScreen: React.FC<RoleProps> = ({ data }) => {

  if (!data) {
    return (<></>);
  }

  return (
    <>
      <div className='roleCard' >
        <h1 className='role'> {data.role} </h1>
        <h3 className='title'> {data.title} </h3>
        <div className='ability'>
          <p> {data.ability} </p>
        </div>
        </div>
    </>
  );
};

export default RoleScreen;