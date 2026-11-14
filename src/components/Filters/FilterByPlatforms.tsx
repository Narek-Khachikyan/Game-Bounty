import { useGetPlatformsDataQuery } from "../../app/redux/features/apiSlice";
import "./filter.scss";
type Props = {
  setFilterByPlatforms: (value: number) => void;
  selectedPlatformId: number;
};
const FilterByPlatforms = ({
  setFilterByPlatforms,
  selectedPlatformId,
}: Props) => {
  const { data, isLoading, isError, refetch } = useGetPlatformsDataQuery();
  return (
    <div className="platform-filter">
      <label>
        Platform
        <select
          value={selectedPlatformId}
          onChange={(event) => setFilterByPlatforms(Number(event.target.value))}
        >
          <option value={0}>All platforms</option>
          {!!selectedPlatformId &&
            !data?.results.some((item) => item.id === selectedPlatformId) && (
              <option value={selectedPlatformId}>
                Selected platform ({selectedPlatformId})
              </option>
            )}
          {data?.results.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {isLoading && <span role="status">Loading platforms…</span>}
      {isError && (
        <span>
          Platforms unavailable.{" "}
          <button onClick={() => void refetch()}>Retry</button>
        </span>
      )}
    </div>
  );
};
export default FilterByPlatforms;
