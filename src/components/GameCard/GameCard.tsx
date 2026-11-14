import { FC, useState } from 'react';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { selectIsFavorite } from '../../app/redux/selectors/favorites';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useAuth } from '../../hooks/useAuth';
import { buildAuthRedirectPath } from '../../lib/authRedirect';
import { removeUserFavorite, upsertUserFavorite } from '../../lib/userFavorites';

type GameCardProps = GameData & {
   selectedPlatformId?: number;
};

const GameCard: FC<GameCardProps> = ({
   id,
   name,
   released,
   background_image,
   metacritic,
   platforms,
   selectedPlatformId,
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
   const gameDetailsPath = selectedPlatformId
      ? `/game/${id}?platform=${selectedPlatformId}`
      : `/game/${id}`;

   const handleAuthRedirect = () => {
      const nextPath = `${location.pathname}${location.search}#game-${id}`;
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
            : !currentUser ? 'Sign in to save' : 'Save game';

   return (
      <article className="card" id={`game-${id}`} tabIndex={-1}>
         <div className="card__container">
            <Link to={gameDetailsPath} className="card__link">
               <div className="card__content">
                  <div className="card__wrapper">
                     <img
                        src={background_image}
                        alt={name ? `${name} cover` : 'Game cover'}
                        loading="lazy"
                     />
                     <div className="card__badges" aria-label="Game metadata">
                        <span className="raiting">Score {metacritic ?? 'N/A'}</span>
                        <span className="released">{released || 'Date TBA'}</span>
                     </div>
                     <div className="card__textWrapper">

                        <h3 className="card__name">{name}</h3>
                        <div className="platform-wrapper">
                           {platforms.map((item) => (
                              <span key={item.platform.id}>{item.platform.name}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </Link>
            {isItemInFavorites ? (
               <button
                  className="remove-button cardButton"
                  aria-label={`Remove ${name} from favorites`}
                  onClick={() => {
                     void removeFavorites();
                  }}
                  disabled={!isAuthReady || isSubmitting}>
                  {buttonLabel}
               </button>
            ) : (
               <button
                  className="add-button cardButton"
                  aria-label={currentUser ? `Add ${name} to favorites` : `Sign in to save ${name}`}
                  onClick={() => {
                     void addFavorites();
                  }}
                  disabled={!isAuthReady || isSubmitting}>
                  {buttonLabel}
               </button>
            )}
            {actionError ? (
               <p
                  role="alert"
                  className="card-error">
                  {actionError}
               </p>
            ) : null}
         </div>
      </article>
   );
};

export default GameCard;
