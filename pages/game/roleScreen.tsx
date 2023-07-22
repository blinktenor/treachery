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

  const unveilRole = ()=>{
    const roleCard = document.querySelector(".roleCard")
    console.log("REVEALED", roleCard, data)
    if(roleCard && data.url){
      roleCard.style.backgroundimage = data.url
    }
  }

  return (
    <>
      <div className="roleCard" >
        <h1 className="Role">{data.role}</h1>
        <h3 className='Title'>{data.title}</h3>
        <div className='ability'>
          <p> {data.ability}</p>
        </div>
        <button onClick={unveilRole}>Unveil</button>
      </div>
    </>
  );
};

export default RoleScreen;