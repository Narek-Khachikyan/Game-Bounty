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
         <section className="bounty-panel overflow-hidden rounded-arcade px-5 py-6 sm:px-8 sm:py-9">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end">
                <div>
                  <p className="bounty-kicker">Arcade Magazine / Issue 01</p>
                  <h1 className="arcade-title mt-4 max-w-4xl text-5xl leading-[0.86] text-arcade-ink sm:text-7xl lg:text-8xl">
                     Find the next game that deserves a weekend.
                  </h1>
                  <p className="bounty-copy mt-5 max-w-2xl text-base sm:text-xl">
                     Browse the RAWG catalog like a loud arcade magazine: scan covers, jump genres, then pin the games worth replaying.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                     <span className="arcade-chip bg-arcade-yellow">Cover scan</span>
                     <span className="arcade-chip bg-arcade-blue text-white">RAWG powered</span>
                     <span className="arcade-chip bg-arcade-panel">Save shelf</span>
                  </div>
                </div>
                <label className="block">
                  <span className="bounty-kicker">Search the issue</span>
                  <input
                     className="searchInput mt-3 w-full rounded-arcade border-[3px] border-arcade-ink bg-white px-5 py-4 text-lg font-black text-arcade-ink shadow-arcade outline-none transition-colors placeholder:text-arcade-muted focus:bg-arcade-yellow"
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

         <div className="titleSearch my-8 flex flex-wrap items-end justify-between gap-4 border-y-[3px] border-arcade-ink bg-arcade-ink px-4 py-4 text-arcade-paper">
            <div>
               <p className="text-xs font-black uppercase tracking-[0.22em] text-arcade-yellow">Now on the rack</p>
               <h2 className="arcade-title mt-1 text-2xl sm:text-4xl">
                  Poster Grid
               </h2>
            </div>
            <p className="rounded-full border-2 border-arcade-paper bg-arcade-red px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-white">
               {isLoading ? 'Scanning...' : `${gamesData?.results.length ?? 0} shown`}
            </p>
         </div>

         {gamesDataError && (
            <p className="bounty-panel rounded-arcade px-5 py-6 text-center text-base font-black text-arcade-red">
               {isConfigurationError
                  ? 'Configuration error: missing RAWG_API_KEY on the server. Add it to the server environment and restart the app.'
                  : 'Failed to load games. Please try again later.'}
            </p>
         )}
         {!gamesDataError && !isLoading && !hasResults && (
            <div className="bounty-panel rounded-arcade px-5 py-10 text-center">
               <p className="arcade-title text-3xl text-arcade-ink">No games made this issue.</p>
               <p className="bounty-copy mx-auto mt-3 max-w-xl">Try another title, genre, or platform filter to refill the poster rack.</p>
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
