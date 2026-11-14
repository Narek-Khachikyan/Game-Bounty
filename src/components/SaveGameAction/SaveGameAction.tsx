import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { GameData } from '../../@types/types';
import { selectIsFavorite } from '../../app/redux/selectors/favorites';
import { useAppSelector } from '../../app/hooks';
import { useAuth } from '../../hooks/useAuth';
import { buildAuthRedirectPath } from '../../lib/authRedirect';
import { removeUserFavorite, upsertUserFavorite } from '../../lib/userFavorites';

const SaveGameAction = ({ game }: { game: GameData }) => {
   const { id, name } = game;
   const navigate = useNavigate();
   const location = useLocation();
   const isItemInFavorites = useAppSelector(selectIsFavorite(id));
   const { currentUser, isAuthReady } = useAuth();
   const [pendingAction, setPendingAction] = useState<'saving' | 'removing' | null>(null);
   const isSubmitting = pendingAction !== null;
   const [actionError, setActionError] = useState<string | null>(null);
   const [completionMessage, setCompletionMessage] = useState('');

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
      setCompletionMessage('');
      setPendingAction('saving');

      try {
         await upsertUserFavorite(currentUser.uid, game);
         setCompletionMessage(`Saved ${name} to favorites.`);
      } catch {
         setActionError('Unable to save this game right now.');
      } finally {
         setPendingAction(null);
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
      setCompletionMessage('');
      setPendingAction('removing');

      try {
         await removeUserFavorite(currentUser.uid, id);
         setCompletionMessage(`Removed ${name} from favorites.`);
      } catch {
         setActionError('Unable to remove this game right now.');
      } finally {
         setPendingAction(null);
      }
   };

   const pendingLabel = !isAuthReady
      ? `Checking session for ${name}`
      : pendingAction === 'saving'
         ? `Saving ${name} to favorites`
         : pendingAction === 'removing'
            ? `Removing ${name} from favorites`
            : '';
   const buttonLabel = !isAuthReady
      ? 'Checking session...'
      : pendingAction === 'saving'
         ? 'Saving...'
         : pendingAction === 'removing'
            ? 'Removing...'
            : isItemInFavorites ? 'Remove' : 'Save game';

   return (
      <>
         {isItemInFavorites ? (
            <button
               className="remove-button cardButton btn"
               aria-label={pendingLabel || `Remove ${name} from favorites`}
               aria-busy={!isAuthReady || isSubmitting}
               onClick={() => {
                  void removeFavorites();
               }}
               disabled={!isAuthReady || isSubmitting}>
               {buttonLabel}
            </button>
         ) : (
            <button
               className="add-button cardButton btn"
               aria-label={pendingLabel || (currentUser ? `Add ${name} to favorites` : `Sign in to save ${name}`)}
               aria-busy={!isAuthReady || isSubmitting}
               onClick={() => {
                  void addFavorites();
               }}
               disabled={!isAuthReady || isSubmitting}>
               {buttonLabel}
            </button>
         )}
         <span className="sr-only" role="status">{pendingLabel || completionMessage}</span>
         {actionError ? (
            <p
               role="alert"
               className="card-error">
               {actionError}
            </p>
         ) : null}
      </>
   );
};

export default SaveGameAction;
