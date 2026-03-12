import { FC, useState } from 'react';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { selectIsFavorite } from '../../app/redux/selectors/favorites';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useAuth } from '../../hooks/useAuth';
import { buildAuthRedirectPath } from '../../lib/authRedirect';
import { removeUserFavorite, upsertUserFavorite } from '../../lib/userFavorites';

const GameCard: FC<GameData> = ({
   id,
   name,
   released,
   background_image,
   metacritic,
   platforms,
}) => {
   const navigate = useNavigate();
   const location = useLocation();
   const isItemInFavorites = useAppSelector(selectIsFavorite(id));
   const { currentUser, isAuthReady } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [actionError, setActionError] = useState<string | null>(null);
   const item = {
      id,
      name,
      released,
      background_image,
      metacritic,
      platforms,
   };

   const handleAuthRedirect = () => {
      const nextPath = `${location.pathname}${location.search}${location.hash}`;
      navigate(buildAuthRedirectPath(nextPath));
   };

   const addFavorites = async () => {
      if (!isAuthReady) {
         return;
      }

      if (!currentUser) {
         handleAuthRedirect();
         return;
      }

      if (isItemInFavorites || isSubmitting) {
         return;
      }

      setActionError(null);
      setIsSubmitting(true);

      try {
         await upsertUserFavorite(currentUser.uid, item);
      } catch {
         setActionError('Unable to save this game right now.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const removeFavorites = async () => {
      if (!isAuthReady) {
         return;
      }

      if (!currentUser) {
         handleAuthRedirect();
         return;
      }

      if (!isItemInFavorites || isSubmitting) {
         return;
      }

      setActionError(null);
      setIsSubmitting(true);

      try {
         await removeUserFavorite(currentUser.uid, id);
      } catch {
         setActionError('Unable to remove this game right now.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const buttonLabel = !isAuthReady
      ? 'Checking session...'
      : isItemInFavorites
         ? isSubmitting
            ? 'Removing...'
            : 'Remove'
         : isSubmitting
            ? 'Saving...'
            : 'Add Game';

   return (
      <div className="card" data-aos="fade-up">
         <div className="card__container">
            <Link to={`/game/${id}`}>
               <div className="card__content">
                  <div className="card__wrapper">
                     <img
                        src={background_image}
                        alt={name ? `${name} cover` : 'Game cover'}
                        loading="lazy"
                     />
                     <p className="raiting bg-white text-violet-800 py-1 px-3">
                        {metacritic ?? 'N/A'}
                     </p>
                     <p className="released bg-white text-violet-800 py-1 px-3">{released}</p>
                     <div className="card__textWrapper bg-white py-3 px-2">
                        <p className="card__name text-violet-900">{name}</p>
                        <div className="platform-wrapper grid grid-cols-2 grid-rows-1">
                           {platforms.map((item) => (
                              <p key={item.platform.id}>{item.platform.name}</p>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </Link>
            {isItemInFavorites ? (
               <button
                  className="remove-button cardButton bg-white text-violet-950"
                  onClick={() => {
                     void removeFavorites();
                  }}
                  disabled={!isAuthReady || isSubmitting}>
                  {buttonLabel}
               </button>
            ) : (
               <button
                  className="add-button cardButton bg-white text-violet-950"
                  onClick={() => {
                     void addFavorites();
                  }}
                  disabled={!isAuthReady || isSubmitting}>
                  {buttonLabel}
               </button>
            )}
            {actionError ? (
               <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
               </p>
            ) : null}
         </div>
      </div>
   );
};

export default GameCard;
