import { useState } from "react";
import { useGetGenresDataQuery } from "../../app/redux/features/apiSlice";
import "./filter.scss";
type Props = {
  selectedGenre: string;
  setFilterByGenres: (value: string) => void;
};
const FilterByGenres = ({ selectedGenre, setFilterByGenres }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, isError, refetch } = useGetGenresDataQuery();
  return (
    <div
      className={`genre-browser ${expanded ? "genre-browser--expanded" : ""}`}
    >
      <h2 className="genre-desktop-title">Browse genres</h2>
      <button
        className="genre-mobile-toggle"
        aria-expanded={expanded}
        aria-controls="genre-options"
        onClick={() => setExpanded(!expanded)}
      >
        Genres:{" "}
        {data?.results.find(
          (item) => (item.slug || item.name.toLowerCase()) === selectedGenre,
        )?.name ||
          selectedGenre ||
          "All genres"}{" "}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div className="genre-options" id="genre-options">
        <button
          type="button"
          aria-pressed={!selectedGenre}
          onClick={() => setFilterByGenres("")}
        >
          <span aria-hidden="true">▦</span>All genres
        </button>
        {data?.results.map((item) => {
          const value = item.slug || item.name.toLowerCase();
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selectedGenre === value}
              onClick={() => setFilterByGenres(value)}
            >
              <span aria-hidden="true">◇</span>
              {item.name}
            </button>
          );
        })}
      </div>
      {isLoading && (
        <p className="filter-message" role="status">
          Loading genres…
        </p>
      )}
      {isError && (
        <p className="filter-message">
          Genres unavailable.{" "}
          <button onClick={() => void refetch()}>Retry</button>
        </p>
      )}
    </div>
  );
};
export default FilterByGenres;
