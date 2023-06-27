import { useGetGamesDataQuery } from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import Skeleton from '../components/Skeleton/Skeleton';

const Games = () => {
   const { data: gamesData } = useGetGamesDataQuery('');
   const skeletons = [...new Array(12)].map((_, index) => <Skeleton key={index} />);

   return (
      <div className="games py-10">
         <p className="games-title text-white text-3xl mb-8">Popular Games</p>
         <div className={'games__content grid grid-cols-4 grid-rows-3 gap-11'}>
            {gamesData
               ? gamesData.results.map((item) => <GameCard key={item.id} {...item} />)
               : skeletons}
         </div>
      </div>
   );
};

export default Games;
