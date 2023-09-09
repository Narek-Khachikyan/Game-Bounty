import { FC } from 'react';
import { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { removeItem } from '../../app/redux/features/favoriteSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const FavoritesCard: FC<GameData> = ({
   id,
   background_image,
   metacritic,
   name,
   platforms,
   released,
}) => {
   const dispatch = useDispatch();
   const onClickRemove = () => {
      dispatch(removeItem(id));
   };

   return (
      <div>
         <div className="card">
            <div className="card__container">
               <Link to={`/game/${id}`}>
                  <div className="card__content">
                     <div className="card__wrapper">
                        <img src={background_image} alt="favoriteCardImg" />
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
               <button className="cardButton bg-white text-violet-950" onClick={onClickRemove}>
                  Remove
               </button>
            </div>
         </div>
      </div>
   );
};

export default FavoritesCard;
