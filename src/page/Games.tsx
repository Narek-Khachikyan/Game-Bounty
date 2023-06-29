import { useState } from 'react';
import { useGetGamesDataQuery } from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import { SkeletonCard } from '../components/Skeleton/Skeleton';
import FilterByGenres from '../components/Filters/FilterByGenres';

const Games = () => {
   const [filterByGenres, setFilterByGenres] = useState('action');
   const { data: gamesData } = useGetGamesDataQuery(filterByGenres);
   const skeletons = [...new Array(12)].map((_, index) => <SkeletonCard key={index} />);
   console.log(filterByGenres);
   return (
      <div className="games py-10">
         <FilterByGenres setFilterByGenres={setFilterByGenres} />
         <p className="games-title text-white mb-8 text-2xl sm:text-2xl md:text-3xl">
            Popular Games
         </p>
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
