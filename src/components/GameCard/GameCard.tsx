import React, { FC } from 'react';
import type { GameData } from '../../@types/types';
import './gameCard.scss';

const GameCard: FC<GameData> = ({
   name,
   released,
   background_image,
   rating,
   rating_top,
   metacritic,
   platforms,
}) => {
   return (
      <div className="gameCard">
         <div className="gameCard__container">
            <div className="gameCard__content">
               <div className="gameCard__wrapper">
                  <img src={background_image} alt="" />
                  <div className="gameCard__textWrapper bg-white py-3 px-2">
                     <p className="gameCard__name text-blue-950">{name}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default GameCard;
