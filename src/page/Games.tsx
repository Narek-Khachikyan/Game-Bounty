import { useState } from 'react';
import {
   isRawgProxyConfigurationError,
   useGetGamesDataQuery,
} from '../app/redux/features/apiSlice';
import GameCard from '../components/GameCard/GameCard';
import { SkeletonCard } from '../components/Skeleton/Skeleton';
import FilterByGenres from '../components/Filters/FilterByGenres';
import useDebounce from '../hooks/useDebounce';
import '../GlobalStyles/globalCardStyles.scss';
import FilterByPlatforms from '../components/Filters/FilterByPlatforms';

const Games = () => {
   const [query, setQuery] = useState('');
   const debouncedQuery = useDebounce(query, 500);
   const [filterByGenres, setFilterByGenres] = useState('action');
   const [filterByPlatforms, setFilterByPlatforms] = useState(1);
   const {
      data: gamesData,
      isLoading: gamesDataLoading,
      isFetching: gamesDataFetching,
      isError: gamesDataError,
      error: gamesDataErrorDetails,
   } = useGetGamesDataQuery({
      filterByGenres,
      debouncedQuery,
      filterByPlatforms,
   });
   const isConfigurationError = isRawgProxyConfigurationError(gamesDataErrorDetails);
   const isLoading = (gamesDataLoading || gamesDataFetching) && !gamesData;
   const hasResults = (gamesData?.results ?? []).length > 0;
   const skeletons = [...new Array(12)].map((_, index) => <SkeletonCard key={index} />);

   return (
      <main className="games py-8 sm:py-12">
         <section className="bounty-panel rounded-dossier px-5 py-6 sm:px-8 sm:py-9">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
               <div>
                  <p className="bounty-kicker">Live bounty board</p>
                  <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-bounty-ink sm:text-6xl">
                     Track the next game worth chasing.
                  </h1>
                  <p className="bounty-copy mt-5 max-w-2xl text-base sm:text-lg">
                     Search RAWG contracts, filter by genre and platform, then save the games you want to return to.
                  </p>
               </div>
               <label className="block">
                  <span className="bounty-kicker">Search contracts</span>
                  <input
                     className="searchInput mt-3 w-full rounded-3xl border border-bounty-line bg-bounty-canvas/70 px-5 py-4 text-base font-semibold text-bounty-ink shadow-inner outline-none transition-colors placeholder:text-bounty-muted focus:border-bounty-amber"
                     type="search"
                     value={query}
                     placeholder="Search by game title..."
                     onChange={(event) => setQuery(event.target.value)}
                  />
               </label>
            </div>
         </section>

         <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <FilterByGenres setFilterByGenres={setFilterByGenres} />
            <FilterByPlatforms
               selectedPlatformId={filterByPlatforms}
               setFilterByPlatforms={setFilterByPlatforms}
            />
         </section>

         <div className="titleSearch my-8 flex flex-wrap items-end justify-between gap-4">
            <div>
               <p className="bounty-kicker">Available targets</p>
               <h2 className="games-title mt-2 text-2xl font-black tracking-[-0.04em] text-bounty-ink sm:text-3xl md:text-4xl">
                  Popular game contracts
               </h2>
            </div>
            <p className="rounded-full border border-bounty-line bg-white/5 px-4 py-2 text-sm font-bold text-bounty-muted">
               {isLoading ? 'Scanning...' : `${gamesData?.results.length ?? 0} shown`}
            </p>
         </div>

         {gamesDataError && (
            <p className="bounty-panel rounded-3xl px-5 py-6 text-center text-base text-red-100">
               {isConfigurationError
                  ? 'Configuration error: missing RAWG_API_KEY on the server. Add it to the server environment and restart the app.'
                  : 'Failed to load games. Please try again later.'}
            </p>
         )}
         {!gamesDataError && !isLoading && !hasResults && (
            <div className="bounty-panel rounded-3xl px-5 py-10 text-center">
               <p className="text-2xl font-black text-bounty-ink">No contracts matched.</p>
               <p className="bounty-copy mt-3">Try another title, genre, or platform filter.</p>
            </div>
         )}
         <div className="games__content grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
               ? skeletons
               : gamesData?.results.map((item) => (
                    <GameCard
                       key={item.id}
                       {...item}
                       selectedPlatformId={filterByPlatforms}
                    />
                 ))}
         </div>
      </main>
   );
};

export default Games;
