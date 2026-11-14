import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import GameArtwork from './GameArtwork';

it('retains identity on a failed image and recovers for a different source', () => {
 const { rerender } = render(<GameArtwork src="/missing.jpg" name="Hades" />);
 fireEvent.error(screen.getByRole('img'));
 expect(screen.getByRole('img', { name:'Hades: artwork unavailable' })).toBeInTheDocument();
 rerender(<GameArtwork src="/working.jpg" name="Hades" />);
 expect(screen.getByRole('img', { name:'Hades artwork' })).toHaveAttribute('src','/working.jpg');
});
