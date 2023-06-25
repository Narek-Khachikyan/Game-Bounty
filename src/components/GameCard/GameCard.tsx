import { FC } from 'react';
import type { GameData } from '../../@types/types';
import './gameCard.scss';

const GameCard: FC<GameData> = ({ name, released, background_image, metacritic, platforms }) => {
   return (
      <div className="gameCard">
         <div className="gameCard__container">
            <div className="gameCard__content">
               <div className="gameCard__wrapper">
                  <img src={background_image} alt="" />
                  <p className="raiting bg-white text-violet-800 py-1 px-3">{metacritic}</p>
                  <p className="released bg-white text-violet-800 py-1 px-3">{released}</p>
                  <div className="gameCard__textWrapper bg-white py-3 px-2">
                     <p className="gameCard__name text-violet-900">{name}</p>
                     <div className="platform-wrapper grid grid-cols-2 grid-rows-1">
                        {platforms.map((item) => (
                           <p>{item.platform.name}</p>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default GameCard;
