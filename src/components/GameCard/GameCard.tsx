import { FC, useState } from 'react';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../app/redux/features/favoriteSlice';
import { Link } from 'react-router-dom';

const GameCard: FC<GameData> = ({
   id,
   name,
   released,
   background_image,
   metacritic,
   platforms,
}) => {
   const dispatch = useDispatch();
   const cartItems = useSelector((state: any) => state.favorites.items);
   const [isActive, setIsActive] = useState(true);

   const addFavorites = () => {
      const item = {
         id,
         name,
         released,
         background_image,
         metacritic,
         platforms,
      };
      const isItemInFavorites = cartItems.some(
         (favoritesItem: GameData) => favoritesItem.id === item.id,
      );
      if (!isItemInFavorites) {
         dispatch(addItem(item));
         setIsActive(false);
      }
   };

   return (
      <div className="card">
         <div className="card__container">
            <Link to={`/game/${id}`}>
               <div className="card__content">
                  <div className="card__wrapper">
                     <img src={background_image} alt="" />
                     <p className="raiting bg-white text-violet-800 py-1 px-3">{metacritic}</p>
                     <p className="released bg-white text-violet-800 py-1 px-3">{released}</p>
                     <div className="card__textWrapper bg-white py-3 px-2">
                        <p className="card__name text-violet-900">{name}</p>
                        <div className="platform-wrapper grid grid-cols-2 grid-rows-1">
                           {platforms.map((item) => (
                              <p>{item.platform.name}</p>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </Link>
            <button className="add-button bg-white text-violet-950" onClick={addFavorites}>
               {isActive ? <p>ADD Game</p> : <p>ADDED</p>}
            </button>
         </div>
      </div>
   );
};

export default GameCard;
