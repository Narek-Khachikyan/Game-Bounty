import { FC, useState } from 'react';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { removeUserFavorite } from '../../lib/userFavorites';

const FavoritesCard: FC<GameData> = ({
   id,
   background_image,
   metacritic,
   name,
   platforms,
   released,
}) => {
   const { currentUser } = useAuth();
   const [isRemoving, setIsRemoving] = useState(false);
   const [actionError, setActionError] = useState<string | null>(null);

   const onClickRemove = async () => {
      if (!currentUser || isRemoving) {
         return;
      }

      setActionError(null);
      setIsRemoving(true);

      try {
         await removeUserFavorite(currentUser.uid, id);
      } catch {
         setActionError('Unable to remove this game right now.');
      } finally {
         setIsRemoving(false);
      }
   };

   return (
      <li>
         <div className="card">
            <div className="card__container">
               <Link to={`/game/${id}`} className="card__link">
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
                           <p className="card__eyebrow">Pinned cover</p>
                           <h2 className="card__name">{name}</h2>
                           <div className="platform-wrapper">
                              {platforms.map((item) => (
                                 <span key={item.platform.id}>{item.platform.name}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </Link>
               <button
                  className="cardButton"
                  aria-label={`Remove ${name} from favorites`}
                  onClick={() => {
                     void onClickRemove();
                  }}
                  disabled={isRemoving}>
                  {isRemoving ? 'Removing...' : 'Remove'}
               </button>
            </div>
         </div>
         {actionError ? (
            <p
               role="alert"
                className="mt-3 rounded-arcade border-[3px] border-arcade-ink bg-arcade-red px-4 py-3 text-sm font-black text-white">
               {actionError}
            </p>
         ) : null}
      </li>
   );
};

export default FavoritesCard;
