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
      <div className="genres mb-2">
         <p className="filter-heading text-white mb-4 text-2xl sm:text-2xl md:text-3xl">
            Sort By: Genres
         </p>
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
                     className={
                        isActive === index
                           ? 'genreItem bg-white text-violet-950 py-1 px-2 text-center activeGenre rounded-2xl'
                           : 'genreItem bg-white text-violet-950 py-1 px-2 text-center rounded-2xl'
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
