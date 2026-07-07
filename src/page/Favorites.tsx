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
      <main className="favorites py-8 sm:py-12">
         <section className="bounty-panel mb-8 rounded-arcade px-5 py-6 sm:px-8 sm:py-9">
            <div className="textWrapper flex flex-wrap items-end justify-between gap-4">
               <div>
                  <p className="bounty-kicker">Saved shelf</p>
                  <h1 className="arcade-title mt-3 text-4xl leading-[0.9] text-arcade-ink sm:text-6xl">
                     Your Replay Rack
                  </h1>
                  <p className="bounty-copy mt-3 max-w-2xl">
                     Your Firebase-backed shelf of games to inspect, compare, and return to when the weekend opens up.
                  </p>
               </div>
               {cartItems.length === 0 ? null : (
                  <button
                     className="clear-btn bounty-button bounty-button--danger px-5 py-3 text-sm"
                     aria-label={`Clear ${cartItems.length} saved ${cartItems.length === 1 ? 'game' : 'games'}`}
                     onClick={() => {
                     void handleClearCart();
                  }}
                  disabled={isClearing || favoritesStatus !== 'ready'}>
                  {isClearing ? 'Clearing...' : 'Clear saved'}
               </button>
               )}
            </div>
         </section>

         {actionError ? (
            <p
               role="alert"
                className="mb-6 rounded-arcade border-[3px] border-arcade-ink bg-arcade-red px-4 py-3 text-sm font-black text-white">
               {actionError}
            </p>
         ) : null}

         {favoritesStatus === 'loading' ? (
            <p
               aria-live="polite"
                className="bounty-panel my-8 rounded-arcade px-5 py-8 text-center text-2xl font-black text-arcade-ink">
               Pulling games from your shelf...
            </p>
         ) : favoritesStatus === 'error' ? (
            <p
               role="alert"
                className="bounty-panel my-8 rounded-arcade px-5 py-8 text-center text-xl font-black text-arcade-red">
               We could not load your favorites right now. Try refreshing the page.
            </p>
         ) : cartItems.length === 0 ? (
            <div className="bounty-panel my-8 rounded-arcade px-5 py-10 text-center">
               <p className="arcade-title text-4xl leading-[0.9] text-arcade-ink">No games pinned yet.</p>
               <p className="bounty-copy mx-auto mt-3 max-w-xl">
                  Return to the catalog and pin a cover when something looks worth replaying.
               </p>
            </div>
         ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {cartItems.map((item: GameData) => (
                  <FavoritesCard key={item.id} {...item} />
               ))}
            </ul>
         )}
      </main>
   );
};

export default Favorites;
