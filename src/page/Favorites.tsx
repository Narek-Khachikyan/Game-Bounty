import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearFavorites } from '../app/redux/features/favoriteSlice';
import { GameData } from '../@types/types';
import FavoritesCard from '../components/FavoritesCard.tsx/FavoritesCard';

const Favorites: React.FC = () => {
   const cartItems = useSelector((state: any) => state.favorites.items);
   const dispatch = useDispatch();

   const handleClearCart = () => {
      dispatch(clearFavorites());
   };

   return (
      <div className="favorites py-10">
         <div className="textWrapper mb-8 flex items-center justify-between">
            <h2 className="text-white text-2xl sm:text-2xl md:text-3xl">Favorites</h2>
            {cartItems.length === 0 ? null : (
               <button
                  className="clear-btn text-white bg-violet-900 text-sm md:text-xl py-3 px-2"
                  onClick={handleClearCart}>
                  CLEAR FAVORITES
               </button>
            )}
         </div>

         {cartItems.length === 0 ? (
            <p className="text-violet-950 text-3xl my-8 text-center bg-white py-2 rounded-2xl">
               Favorites is empty
            </p>
         ) : (
            <ul className=" flex flex-col gap-8">
               {cartItems.map((item: GameData) => (
                  <FavoritesCard key={item.id} {...item} />
               ))}
            </ul>
         )}
      </div>
   );
};

export default Favorites;
