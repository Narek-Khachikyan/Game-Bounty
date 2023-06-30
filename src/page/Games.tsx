import { useState } from 'react';
import { useGetGamesDataQuery } from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import { SkeletonCard } from '../components/Skeleton/Skeleton';
import FilterByGenres from '../components/Filters/FilterByGenres';
import useDebounce from '../hooks/useDebounce';

const Games = () => {
   const [query, setQuery] = useState('');
   const debouncedQuery = useDebounce(query, 500);
   const [filterByGenres, setFilterByGenres] = useState('action');
   const { data: gamesData } = useGetGamesDataQuery({ filterByGenres, debouncedQuery });
   const skeletons = [...new Array(12)].map((_, index) => <SkeletonCard key={index} />);

   return (
      <div className="games py-10">
         <FilterByGenres setFilterByGenres={setFilterByGenres} />
         <div className="titleSearch my-8 flex flex-wrap justify-center items-center gap-2 sm:items-center sm:justify-between sm:flex-nowrap">
            <p className="games-title text-white text-2xl sm:text-2xl md:text-3xl">Popular Games</p>
            <input
               className="searchInput px-2 py-1 rounded-2xl w-full sm:w-52"
               type="text"
               value={query}
               placeholder="Search Game..."
               onChange={(event) => setQuery(event.target.value)}
            />
         </div>
         <div
            className={
               'games__content grid gap-10 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-3'
            }>
            {gamesData
               ? gamesData.results.map((item) => <GameCard key={item.id} {...item} />)
               : skeletons}
         </div>
      </div>
   );
};

export default Games;
