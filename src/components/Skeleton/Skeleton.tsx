import ContentLoader from 'react-content-loader';
import './skeleton.scss';
export const SkeletonCard = () => (
   <ContentLoader
      className="skeleton-card"
      animate={false}
      width="100%"
      height="auto"
      viewBox="0 0 300 300"
      backgroundColor="var(--panel, #151515)"
      foregroundColor="var(--line, #343434)">
      <rect x="0" y="0" rx="8" ry="8" width="300" height="230" />
      <rect x="0" y="245" rx="8" ry="8" width="300" height="48" />
   </ContentLoader>
);

export const GamesInfoCardSkelton = () => {
   return (
      <div className="GamesInfoCardSkeleton" role="status">
          <p>Loading game details…</p>
      </div>
   );
};
export const GameBountySkeleton = () => {
   return (
      <div className="GameBoundy" role="status">
          <p>Loading genres…</p>
      </div>
   );
};
