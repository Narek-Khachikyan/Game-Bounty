import { useState } from 'react';
import { useGetGenresDataQuery } from '../../app/redux/features/apiSlice';
import { GameBountySkeleton } from '../Skeleton/Skeleton';
import './filter.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

type FilterByGenresProps = {
   setFilterByGenres: (value: string) => void;
};
const FilterByGenres = ({ setFilterByGenres }: FilterByGenresProps) => {
   const { data: genresData, isLoading: genresDataLoading } = useGetGenresDataQuery();
   const [isActive, setIsActive] = useState(0);

   const handleClick = (name: string, index: number) => {
      setFilterByGenres(name);
      setIsActive(index);
   };

   return (
      <div className="genres bounty-panel rounded-3xl px-4 py-5 sm:px-6">
         <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
               <p className="bounty-kicker">Target class</p>
               <h2 className="filter-heading mt-1 text-xl font-black tracking-[-0.03em] text-bounty-ink sm:text-2xl">
                  Genres
               </h2>
            </div>
            <p className="text-sm font-semibold text-bounty-muted">Drag the rail to scan more</p>
         </div>
         <Swiper
            className="genres__list flex gap-3 items-center pb-8"
            modules={[Scrollbar]}
            scrollbar={{ draggable: true }}
            spaceBetween={50}
            breakpoints={{
               320: {
                  slidesPerView: 2,
                  spaceBetween: 10,
               },
               425: {
                  slidesPerView: 2,
                  spaceBetween: 12,
               },
               640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
               },
               768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
               },
               1024: {
                  slidesPerView: 5,
                  spaceBetween: 40,
               },
            }}
            slidesPerView={3}>
            {genresData?.results.map((item, index) => (
               <SwiperSlide key={item.id}>
                  <button
                     type="button"
                     onClick={() => handleClick(item.name.toLowerCase(), index)}
                     aria-pressed={isActive === index}
                     className={
                        isActive === index
                           ? 'genreItem activeGenre'
                           : 'genreItem'
                     }>
                     {item.name}
                  </button>
               </SwiperSlide>
            ))}
         </Swiper>
         {genresDataLoading && <GameBountySkeleton />}
      </div>
   );
};

export default FilterByGenres;
