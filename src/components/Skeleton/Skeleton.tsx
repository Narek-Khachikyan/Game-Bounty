import ContentLoader from 'react-content-loader';
import './skeleton.scss';
export const SkeletonCard = () => (
   <ContentLoader
      speed={2}
      width={300}
      height={420}
      viewBox="0 0 300 420"
      backgroundColor="#ffe7a7"
      foregroundColor="#ffd23f">
      <rect x="0" y="0" rx="20" ry="20" width="300" height="360" />
      <rect x="0" y="372" rx="14" ry="14" width="300" height="48" />
   </ContentLoader>
);

export const GamesInfoCardSkelton = () => {
   return (
      <div className="GamesInfoCardSkeleton text-center text-3xl text-white">
          <p>Printing feature page...</p>
      </div>
   );
};
export const GameBountySkeleton = () => {
   return (
      <div className="GameBoundy text-3xl text-white">
          <p>Loading magazine rail...</p>
      </div>
   );
};
