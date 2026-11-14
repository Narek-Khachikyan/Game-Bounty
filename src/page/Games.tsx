import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  isRawgProxyConfigurationError,
  useGetGamesDataQuery,
  useGetGenresDataQuery,
  useGetPlatformsDataQuery,
} from "../app/redux/features/apiSlice";
import SaveGameAction from "../components/SaveGameAction/SaveGameAction";
import GameArtwork from "../components/GameArtwork/GameArtwork";
import GameCard from "../components/GameCard/GameCard";
import { SkeletonCard } from "../components/Skeleton/Skeleton";
import FilterByGenres from "../components/Filters/FilterByGenres";
import FilterByPlatforms from "../components/Filters/FilterByPlatforms";
import { useDiscoveryMotion } from "../hooks/useDiscoveryMotion";
import useDebounce from "../hooks/useDebounce";
import "../GlobalStyles/globalCardStyles.scss";

const Games = () => {
  const motionRef = useDiscoveryMotion();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const query = params.get("q") || "";
  const filterByGenres = params.get("genre") || "";
  const platform = Number(params.get("platform"));
  const filterByPlatforms =
    Number.isSafeInteger(platform) && platform > 0 ? platform : 0;
  const rawPage = Number(params.get("page"));
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const { data: genres } = useGetGenresDataQuery();
  const { data: platforms } = useGetPlatformsDataQuery();
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
    ...(page > 1 ? { page } : {}),
  });
  const updateFilter = (key: string, value: string) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (key !== "page") next.delete("page");
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const goToPage = (nextPage: number) => {
    updateFilter("page", String(nextPage));
    document.getElementById("results-title")?.focus();
  };
  const isUpdating = isFetching || query !== debouncedQuery;
  const results = gamesData?.results ?? [];
  const hasFilters = !!(query || filterByGenres || filterByPlatforms);
  const featured = !hasFilters && !isError && page === 1 ? results[0] : undefined;
  const gridResults = featured ? results.slice(1) : results;
  const genreName = genres?.results.find(item => (item.slug || item.name.toLowerCase()) === filterByGenres)?.name || filterByGenres;
  const platformName = platforms?.results.find(item => item.id === filterByPlatforms)?.name || `Platform ${filterByPlatforms}`;
  useEffect(() => {
    if (gamesData && location.hash.startsWith("#game-")) {
      document.getElementById(location.hash.slice(1))?.focus();
    }
  }, [gamesData, location.hash]);

  return (
    <main id="main-content" className="discovery">
      <div className="discovery-intro hero" data-enter data-moment="cursor-spotlight" data-moment-opts='{"grid":false,"radius":240}' ref={motionRef}>
        <div className="hero-text">
          <p className="catalog-kicker">Game-Bounty / The catalog</p>
          <h1>Game discovery<span className="title-stop">.</span></h1>
        </div>
        <p className="discovery-lead">Find a game. Check the details.<br />Keep a collection of what’s next.</p>
      </div>
      <div className="discovery-controls" aria-label="Catalog controls">
        <label className="catalog-search">
          <span className="search-label">Search games</span>
          <span className="search-field"><span aria-hidden="true">⌕</span>
          <input type="search" value={query} placeholder="Search by title…"
            onChange={(event) => updateFilter("q", event.target.value)} /></span>
        </label>
        <FilterByPlatforms selectedPlatformId={filterByPlatforms}
          setFilterByPlatforms={(value) => updateFilter("platform", value ? String(value) : "")} />
      </div>
      <div className="discovery-layout">
        <aside className="discovery-sidebar" aria-label="Browse genres">
          <FilterByGenres
            selectedGenre={filterByGenres}
            setFilterByGenres={(value) => updateFilter("genre", value)}
          />
        </aside>
        <div className="discovery-results">
          <section aria-labelledby="results-title">
            <div className="results-toolbar">
              <div>
                <h2 id="results-title" tabIndex={-1}>
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
            </div>
          {featured && (
            <section id={`game-${featured.id}`} tabIndex={-1} className="featured-game" aria-label="Explore a game from your results">
              <div className="featured-game__content">
                <p className="catalog-kicker">Catalog spotlight / 01</p>
                <h2>{featured.name}</h2>
                <div className="feature-facts">
                  <span>Metacritic <strong>{featured.metacritic ?? "Unrated"}</strong></span>
                  <span>{featured.platforms.map(item => item.platform.name).join(" / ") || "Platforms TBA"}</span>
                </div>
                <div className="feature-actions">
                <Link className="feature-link btn" to={`/game/${featured.id}`}>
                  View game <span aria-hidden="true">↗</span>
                </Link>
                <SaveGameAction game={featured} />
                </div>
              </div>
              <Link className="featured-game__art m-zoom" to={`/game/${featured.id}`} aria-label={`View ${featured.name}`}>
                <GameArtwork src={featured.background_image} name={featured.name} eager />
              </Link>
            </section>
          )}
            <div className="active-filters">
              <span>{hasFilters ? "Filtered catalog" : "All genres / All platforms"}</span>
              <div className="filter-chips">
                {filterByGenres && <button onClick={() => updateFilter("genre", "")} aria-label={`Remove genre ${genreName}`}>{genreName} ×</button>}
                {!!filterByPlatforms && <button onClick={() => updateFilter("platform", "")} aria-label={`Remove platform ${platformName}`}>{platformName} ×</button>}
              </div>
              {hasFilters && (
                <button type="button" onClick={() => setParams({})}>
                  Clear search & filters
                </button>
              )}
            </div>
            {isError ? (
              <div className="catalog-state" role="alert">
                <span className="state-icon" aria-hidden="true">/ !</span>
                <h3>The game catalog is unavailable.</h3>
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
                  : gridResults.map((item) => (
                      <GameCard
                        key={item.id}
                        {...item}
                        selectedPlatformId={filterByPlatforms}
                      />
                    ))}
              </div>
            )}
            {(page > 1 || gamesData?.next) && (
              <nav className="catalog-pagination" aria-label="Catalog pages">
                <button className="bounty-button bounty-button--secondary btn" disabled={page <= 1 || isUpdating} onClick={() => goToPage(page - 1)}>Previous page</button>
                <span>Page {page}</span>
                <button className="bounty-button bounty-button--secondary btn" disabled={!gamesData?.next || isUpdating || isError} onClick={() => goToPage(page + 1)}>Next page <span aria-hidden="true">→</span></button>
              </nav>
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
