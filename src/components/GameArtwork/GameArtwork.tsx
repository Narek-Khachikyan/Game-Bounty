import { useState } from 'react';

type Props = { src: string; name: string; eager?: boolean };

/** Preserve the frame and game identity when upstream artwork is missing. */
const GameArtwork = ({ src, name, eager = false }: Props) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return src && failedSource !== src ? (
    <img src={src} alt={`${name} artwork`} loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailedSource(src)} />
  ) : (
    <div className="artwork-fallback" role="img" aria-label={`${name}: artwork unavailable`}>
      <span aria-hidden="true">GB /</span><span>{name}</span>
    </div>
  );
};
export default GameArtwork;
