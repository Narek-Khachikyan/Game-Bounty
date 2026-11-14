import ContentLoader from 'react-content-loader';
import './skeleton.scss';
export const SkeletonCard = () => (
   <ContentLoader
      speed={2}
      width={300}
      height={300}
      viewBox="0 0 300 300"
      backgroundColor="#182332"
      foregroundColor="#304056">
      <rect x="0" y="0" rx="20" ry="20" width="300" height="230" />
      <rect x="0" y="245" rx="14" ry="14" width="300" height="48" />
   </ContentLoader>
);

export const GamesInfoCardSkelton = () => {
   return (
      <div className="GamesInfoCardSkeleton text-center text-3xl text-white">
          <p>Loading game details…</p>
      </div>
   );
};
export const GameBountySkeleton = () => {
   return (
      <div className="GameBoundy text-3xl text-white">
          <p>Loading genres…</p>
      </div>
   );
};
