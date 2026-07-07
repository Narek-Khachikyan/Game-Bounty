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
      <article className="dlcCard w-full h-full">
         <div className="dlcCard__container w-full h-full">
            <div className="dlcCard__content w-full h-full flex flex-col gap-2">
               <div className="dlcCard__img w-full shrink-0">
                  <img
                     className="w-full h-full rounded-2xl"
                     src={background_image}
                     alt={name ? `${name} cover` : 'DLC cover'}
                     loading="lazy"
                  />
                  <span className="dlcCard__raiting">Score {rating * 2}</span>
                  <span className="dlcCard__released">{released || 'TBA'}</span>
               </div>
               <div className="dlcCard__infoWrapper flex-1">
                  <p className="dlcCard__name text-base font-black text-arcade-ink sm:text-xl">{name}</p>
               </div>
            </div>
         </div>
      </article>
   );
};

export default DlcCard;
