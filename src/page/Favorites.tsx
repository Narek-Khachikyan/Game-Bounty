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
         <section className="bounty-panel mb-8 rounded-dossier px-5 py-6 sm:px-8 sm:py-9">
            <div className="textWrapper flex flex-wrap items-end justify-between gap-4">
               <div>
                  <p className="bounty-kicker">Saved contracts</p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-bounty-ink sm:text-5xl">
                     Saved Bounties
                  </h1>
                  <p className="bounty-copy mt-3 max-w-2xl">
                     Your Firebase-backed shortlist of games to inspect, compare, and return to later.
                  </p>
               </div>
            {cartItems.length === 0 ? null : (
               <button
                  className="clear-btn bounty-button bounty-button--danger px-5 py-3 text-sm"
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
            <p className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
               {actionError}
            </p>
         ) : null}

         {favoritesStatus === 'loading' ? (
            <p className="bounty-panel my-8 rounded-3xl px-5 py-8 text-center text-2xl font-black text-bounty-ink">
               Loading your favorites...
            </p>
         ) : favoritesStatus === 'error' ? (
            <p className="bounty-panel my-8 rounded-3xl px-5 py-8 text-center text-xl text-red-100">
               We could not load your favorites right now. Try refreshing the page.
            </p>
         ) : cartItems.length === 0 ? (
            <div className="bounty-panel my-8 rounded-dossier px-5 py-10 text-center">
               <p className="text-3xl font-black tracking-[-0.04em] text-bounty-ink">No saved bounties yet.</p>
               <p className="bounty-copy mx-auto mt-3 max-w-xl">
                  Return to the catalog and save a game contract when something looks worth chasing.
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
