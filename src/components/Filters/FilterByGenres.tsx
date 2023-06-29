import { useState } from 'react';
import { useGetGenresDataQuery } from '../../app/redux/features/apiSlice';
import { FilterSkeleton } from '../Skeleton/Skeleton';
import './filter.scss';

type FilterByGenresProps = {
   setFilterByGenres: (value: string) => void;
};
const FilterByGenres = ({ setFilterByGenres }: FilterByGenresProps) => {
   const { data: genresData, isLoading: genresDataLoading } = useGetGenresDataQuery('');
   const skeletons = [...new Array(12)].map((_, index) => <FilterSkeleton key={index} />);
   const [isActive, setIsActive] = useState(0);

   const handleClick = (name: string, index: number) => {
      setFilterByGenres(name);
      setIsActive(index);
   };

   return (
      <div className="genres mb-2">
         <p className="text-white mb-8 text-2xl sm:text-2xl md:text-3xl">Sort By: Genres</p>
         <ul className="genres__list flex gap-3 items-center">
            {genresData?.results.map((item, index) => (
               <li
                  onClick={() => handleClick(item.name.toLowerCase(), index)}
                  className={
                     isActive === index
                        ? 'bg-white text-violet-950 py-1 px-2 text-center activeGenre'
                        : 'bg-white text-violet-950 py-1 px-2 text-center'
                  }
                  key={item.id}>
                  {item.name}
               </li>
            ))}
            {genresDataLoading && skeletons}
         </ul>
      </div>
   );
};

export default FilterByGenres;
