import { useGetGamesDataQuery } from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import LazyLoading from '../components/LazyLoading/LazyLoading';

const Games = () => {
   const { data: GamesData, isLoading: LoadingGameData } = useGetGamesDataQuery();

   return (
      <div className="games py-10">
         <p className="games-title text-white text-3xl mb-8">Popular Games</p>
         <div className={GamesData ? 'games__content grid grid-cols-4 grid-rows-3 gap-4' : ''}>
            {GamesData && GamesData.results.map((item) => <GameCard key={item.id} {...item} />)}
         </div>
         {LoadingGameData && <LazyLoading />}
      </div>
   );
};

export default Games;
