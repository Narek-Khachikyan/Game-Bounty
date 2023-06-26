import ContentLoader from 'react-content-loader';

const Skeleton = () => (
   <ContentLoader
      speed={2}
      width={300}
      height={225}
      viewBox="0 0 300 225"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb">
      <rect x="0" y="241" rx="10" ry="10" width="280" height="192" />
      <rect x="0" y="0" rx="15" ry="15" width="300" height="225" />
   </ContentLoader>
);

export default Skeleton;
