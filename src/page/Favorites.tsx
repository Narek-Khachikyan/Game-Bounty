import React from 'react';
import type { GameData } from '../@types/types';
import FavoritesCard from '../components/FavoritesCard/FavoritesCard';
import { useAppSelector } from '../app/hooks';
import { selectFavoritesList, selectFavoritesStatus } from '../app/redux/selectors/favorites';
import { useAuth } from '../hooks/useAuth';
import { clearUserFavorites } from '../lib/userFavorites';

const Favorites: React.FC = () => {
   const { currentUser } = useAuth();
   const cartItems = useAppSelector(selectFavoritesList);
   const favoritesStatus = useAppSelector(selectFavoritesStatus);
   const [isClearing, setIsClearing] = React.useState(false);
   const [actionError, setActionError] = React.useState<string | null>(null);

   const handleClearCart = async () => {
      if (!currentUser || cartItems.length === 0 || isClearing) {
         return;
      }

      setActionError(null);
      setIsClearing(true);

      try {
         await clearUserFavorites(
            currentUser.uid,
            cartItems.map((item) => item.id),
         );
      } catch {
         setActionError('Unable to clear favorites right now.');
      } finally {
         setIsClearing(false);
      }
   };

   if (!currentUser) {
      return null;
   }

   return (
      <div className="favorites py-10">
         <div className="textWrapper mb-8 flex items-center justify-between">
            <h2 className="text-white text-2xl sm:text-2xl md:text-3xl">Favorites</h2>
            {cartItems.length === 0 ? null : (
               <button
                  className="clear-btn text-white bg-violet-900 text-sm md:text-xl py-3 px-2"
                  onClick={() => {
                     void handleClearCart();
                  }}
                  disabled={isClearing || favoritesStatus !== 'ready'}>
                  {isClearing ? 'CLEARING...' : 'CLEAR FAVORITES'}
               </button>
            )}
         </div>

         {actionError ? (
            <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
               {actionError}
            </p>
         ) : null}

         {favoritesStatus === 'loading' ? (
            <p className="text-violet-950 text-3xl my-8 text-center bg-white py-2 rounded-2xl">
               Loading your favorites...
            </p>
         ) : favoritesStatus === 'error' ? (
            <p className="text-red-700 text-xl my-8 text-center bg-white py-4 rounded-2xl">
               We could not load your favorites right now. Try refreshing the page.
            </p>
         ) : cartItems.length === 0 ? (
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
