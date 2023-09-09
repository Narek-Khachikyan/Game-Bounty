import { FC } from 'react';
import './sameSeriesCard.scss';
type SameSeriesProps = {
   name: string;
   released: string;
   background_image: string;
   metacritic: number;
};

const SameSeriesCard: FC<SameSeriesProps> = ({ name, released, background_image, metacritic }) => {
   return (
      <div className="sameSeries w-full h-full">
         <div className="sameSeries__container w-full h-full">
            <div className="sameSeries__content w-full h-full">
               <div className="sameSeries__img w-full h-full">
                  <img
                     className="w-full h-full rounded-2xl"
                     src={background_image}
                     alt="sameSeriesImg"
                  />
                  <p className="sameSeries__metacritic bg-white text-violet-900 px-2 py-1 text-base sm:text-xl rounded-xl">
                     {metacritic}
                  </p>
                  <p className="sameSeries__released bg-white text-violet-900 px-2 py-1 text-base sm:text-xl rounded-xl">
                     {released}
                  </p>
               </div>
               <p className="sameSeries__name text-base text-violet-950 sm:text-xl">{name}</p>
            </div>
         </div>
      </div>
   );
};

export default SameSeriesCard;
