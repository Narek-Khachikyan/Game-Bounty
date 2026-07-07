import ContentLoader from 'react-content-loader';
import './skeleton.scss';
export const SkeletonCard = () => (
   <ContentLoader
      speed={2}
      width={300}
      height={420}
      viewBox="0 0 300 420"
      backgroundColor="#111a2f"
      foregroundColor="#1f2c49">
      <rect x="0" y="0" rx="28" ry="28" width="300" height="360" />
      <rect x="0" y="372" rx="16" ry="16" width="300" height="48" />
   </ContentLoader>
);

export const GamesInfoCardSkelton = () => {
   return (
      <div className="GamesInfoCardSkeleton text-center text-3xl text-white">
         <p>Scanning dossier...</p>
      </div>
   );
};
export const GameBountySkeleton = () => {
   return (
      <div className="GameBoundy text-3xl text-white">
         <p>Loading targets...</p>
      </div>
   );
};
