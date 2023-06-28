import { useGetGamesDataQuery } from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import Skeleton from '../components/Skeleton/Skeleton';

const Games = () => {
   const { data: gamesData } = useGetGamesDataQuery('');
   const skeletons = [...new Array(12)].map((_, index) => <Skeleton key={index} />);

   return (
      <div className="games py-10">
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
