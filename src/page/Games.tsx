import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  isRawgProxyConfigurationError,
  useGetGamesDataQuery,
} from "../app/redux/features/apiSlice";
import GameCard from "../components/GameCard/GameCard";
import { SkeletonCard } from "../components/Skeleton/Skeleton";
import FilterByGenres from "../components/Filters/FilterByGenres";
import FilterByPlatforms from "../components/Filters/FilterByPlatforms";
import useDebounce from "../hooks/useDebounce";
import "../GlobalStyles/globalCardStyles.scss";

const Games = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const query = params.get("q") || "";
  const filterByGenres = params.get("genre") || "";
  const platform = Number(params.get("platform"));
  const filterByPlatforms =
    Number.isSafeInteger(platform) && platform > 0 ? platform : 0;
  const debouncedQuery = useDebounce(query, 500);
  const {
    currentData: gamesData,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetGamesDataQuery({
    filterByGenres,
    debouncedQuery,
    filterByPlatforms,
  });
  const updateFilter = (key: string, value: string) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const isUpdating = isFetching || query !== debouncedQuery;
  const results = gamesData?.results ?? [];
  const featured = !query && !isError ? results[0] : undefined;
  const hasFilters = !!(query || filterByGenres || filterByPlatforms);
  useEffect(() => {
    if (gamesData && location.hash.startsWith("#game-")) {
      document.getElementById(location.hash.slice(1))?.focus();
    }
  }, [gamesData, location.hash]);

  return (
    <main id="main-content" className="discovery">
      <div className="discovery-intro">
        <div>
          <h1>Find your next world.</h1>
          <p>Explore games. Keep the ones you want to come back to.</p>
        </div>
        <label className="catalog-search">
          <span className="sr-only">Search games</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            placeholder="Search games…"
            onChange={(event) => updateFilter("q", event.target.value)}
          />
        </label>
      </div>
      <div className="discovery-layout">
        <aside className="discovery-sidebar" aria-label="Browse genres">
          <FilterByGenres
            selectedGenre={filterByGenres}
            setFilterByGenres={(value) => updateFilter("genre", value)}
          />
          <div className="shelf-note">
            <span aria-hidden="true">◇</span>
            <h2>A good game is worth keeping.</h2>
            <p>Save your discoveries and build your own collection.</p>
            <Link to="/favorites">Your saved games</Link>
          </div>
        </aside>
        <div className="discovery-results">
          {featured && (
            <section
              className="featured-game"
              aria-label="Explore a game from your results"
            >
              <img src={featured.background_image} alt="" />
              <div className="featured-game__content">
                <p>In your discovery</p>
                <h2>{featured.name}</h2>
                <Link
                  className="feature-link"
                  to={`/game/${featured.id}${
                    filterByPlatforms ? `?platform=${filterByPlatforms}` : ""
                  }`}
                >
                  Explore game <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </section>
          )}
          <section aria-labelledby="results-title">
            <div className="results-toolbar">
              <div>
                <h2 id="results-title">
                  {query ? "Search results" : "Discover games"}
                </h2>
                <p role="status">
                  {isUpdating
                    ? "Finding games…"
                    : isError
                    ? "Catalog unavailable"
                    : `${results.length} games on this page`}
                </p>
              </div>
              <FilterByPlatforms
                selectedPlatformId={filterByPlatforms}
                setFilterByPlatforms={(value) =>
                  updateFilter("platform", value ? String(value) : "")
                }
              />
            </div>
            <div className="active-filters">
              <span>
                {filterByGenres ? `Genre: ${filterByGenres}` : "All genres"}
                {filterByPlatforms
                  ? " · Platform filtered"
                  : " · All platforms"}
              </span>
              {hasFilters && (
                <button type="button" onClick={() => setParams({})}>
                  Clear search & filters
                </button>
              )}
            </div>
            {isError ? (
              <div className="catalog-state" role="alert">
                <span className="state-icon" aria-hidden="true">
                  ◇
                </span>
                <h3>The next world will have to wait.</h3>
                <p>
                  {isRawgProxyConfigurationError(error)
                    ? "The game catalog is temporarily unavailable. Please check back later."
                    : "We couldn’t load the games. Check your connection and try again."}
                </p>
                <button
                  className="feature-link"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? "Trying again…" : "Try again"}
                </button>
              </div>
            ) : !isUpdating && !results.length ? (
              <div className="catalog-state">
                <h3>No games found.</h3>
                <p>
                  Try a different title or clear your filters to explore more
                  games.
                </p>
                {hasFilters && (
                  <button
                    className="feature-link"
                    onClick={() => setParams({})}
                  >
                    Clear search & filters
                  </button>
                )}
              </div>
            ) : (
              <div className="games__content" aria-busy={isUpdating}>
                {!gamesData
                  ? Array.from({ length: 6 }, (_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : results.map((item) => (
                      <GameCard
                        key={item.id}
                        {...item}
                        selectedPlatformId={filterByPlatforms}
                      />
                    ))}
              </div>
            )}
          </section>
          <footer className="catalog-footer">
            <span>Game-Bounty</span>
            <p>
              Game data and imagery from{" "}
              <a href="https://rawg.io" target="_blank" rel="noreferrer">
                RAWG
              </a>
              .
            </p>
            <a href="#main-content">Back to top ↑</a>
          </footer>
        </div>
      </div>
    </main>
  );
};
export default Games;
