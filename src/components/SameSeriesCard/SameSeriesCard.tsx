import { FC } from 'react';
import './sameSeriesCard.scss';
type SameSeriesProps = {
   name: string;
   released: string;
   background_image: string;
   metacritic: number | null;
};

const SameSeriesCard: FC<SameSeriesProps> = ({ name, released, background_image, metacritic }) => {
   return (
      <article className="sameSeries w-full h-full">
         <div className="sameSeries__container w-full h-full">
            <div className="sameSeries__content w-full h-full flex flex-col gap-2">
               <div className="sameSeries__img w-full shrink-0">
                  <img
                     className="w-full h-full rounded-2xl"
                     src={background_image}
                     alt={name ? `${name} cover` : 'Game cover'}
                     loading="lazy"
                  />
                  <span className="sameSeries__metacritic">Score {metacritic ?? 'N/A'}</span>
                  <span className="sameSeries__released">{released || 'TBA'}</span>
               </div>
               <div className="flex-1">
                  <p className="sameSeries__name text-base font-black text-bounty-ink sm:text-xl">{name}</p>
               </div>
            </div>
         </div>
      </article>
   );
};

export default SameSeriesCard;
