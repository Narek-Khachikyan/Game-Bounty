import { FC } from 'react';
import './dlcCard.scss';

type DlcProps = {
   name: string;
   background_image: string;
   rating: number;
   released: string;
};

const DlcCard: FC<DlcProps> = ({ name, background_image, rating, released }) => {
   return (
      <div className="dlcCard w-full h-full">
         <div className="dlcCard__container w-full h-full">
            <div className="dlcCard__content w-full h-full">
               <div className="dlcCard__img w-full h-full">
                  <img className="w-full h-full rounded-2xl" src={background_image} alt="dlcImg" />
                  <p className="dlcCard__raiting bg-white text-violet-900 px-2 py-1 text-base sm:text-xl rounded-xl">
                     {rating * 2}
                  </p>
                  <p className="dlcCard__released bg-white text-violet-900 px-2 py-1 text-base sm:text-xl rounded-xl">
                     {released}
                  </p>
               </div>
               <div className="dlcCard__infoWrapper">
                  <p className="dlcCard__name text-base text-violet-950 sm:text-xl">{name}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DlcCard;
