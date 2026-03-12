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
      <div>
         <div className="card">
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
               <button
                  className="cardButton bg-white text-violet-950"
                  onClick={() => {
                     void onClickRemove();
                  }}
                  disabled={isRemoving}>
                  {isRemoving ? 'Removing...' : 'Remove'}
               </button>
            </div>
         </div>
         {actionError ? (
            <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
               {actionError}
            </p>
         ) : null}
      </div>
   );
};

export default FavoritesCard;
