import { FC } from 'react';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../app/redux/features/favoriteSlice';
import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';

const GameCard: FC<GameData> = ({
   id,
   name,
   released,
   background_image,
   metacritic,
   platforms,
}) => {
   const dispatch = useDispatch();
   const cartItems = useSelector((state: RootState) => state.favorites.items);
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

   const addFavorites = () => {
      if (!isItemInFavorites) {
         dispatch(addItem(item));
      }
   };
   const removeFavorites = () => {
      if (isItemInFavorites) {
         dispatch(removeItem(id));
      }
   };

   return (
      <div className="card">
         <div className="card__container">
            <Link to={`/game/${id}`}>
               <div className="card__content">
                  <div className="card__wrapper">
                     <img loading="lazy" src={background_image} alt="gameCardImg" />
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
            {isItemInFavorites ? (
               <button
                  className="remove-button cardButton bg-white text-violet-950"
                  onClick={() => removeFavorites()}>
                  Remove
               </button>
            ) : (
               <button
                  className="add-button cardButton bg-white text-violet-950"
                  onClick={addFavorites}>
                  Add Game
               </button>
            )}
         </div>
      </div>
   );
};

export default GameCard;
