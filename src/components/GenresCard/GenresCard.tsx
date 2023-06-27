import { FC } from 'react';
import { GenresData } from '../../@types/types';
import '../../GlobalStyles/globalcardStyles.scss';

const Genrescard: FC<GenresData> = ({ name, image_background }) => {
   return (
      <div className="card">
         <div className="card__container">
            <div className="card__content">
               <div className="card__wrapper">
                  <img src={image_background} alt="" />
                  <div className="card__textWrapper bg-white py-3 px-2">
                     <p className="card__name text-violet-900">{name}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Genrescard;
