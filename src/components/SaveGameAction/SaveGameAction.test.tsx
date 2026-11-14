import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SaveGameAction from './SaveGameAction';
import { renderWithProviders } from '../../test/renderWithProviders';
import { createGame } from '../../test/factories';
import { removeUserFavorite, upsertUserFavorite } from '../../lib/userFavorites';

vi.mock('../../lib/userFavorites', () => ({
   upsertUserFavorite: vi.fn(),
   removeUserFavorite: vi.fn(),
}));

const game = createGame();
const currentUser = { uid: 'player-1' } as User;

beforeEach(() => { vi.clearAllMocks(); });

describe('save game progress feedback', () => {
   it('exposes delayed saving, prevents duplicate writes, then announces completion', async () => {
      let finishSave!: () => void;
      vi.mocked(upsertUserFavorite).mockReturnValue(new Promise<void>((resolve) => { finishSave = resolve; }));
      renderWithProviders(<SaveGameAction game={game} />, { auth: { currentUser } });
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Add Hades to favorites' }));

      const busyButton = screen.getByRole('button', { name: 'Saving Hades to favorites' });
      expect(busyButton).toHaveAttribute('aria-busy', 'true');
      expect(busyButton).toBeDisabled();
      expect(screen.getByRole('status')).toHaveTextContent('Saving Hades to favorites');
      await user.click(busyButton);
      expect(upsertUserFavorite).toHaveBeenCalledTimes(1);
      expect(upsertUserFavorite).toHaveBeenCalledWith('player-1', game);

      await act(async () => finishSave());
      expect(screen.getByRole('button', { name: 'Add Hades to favorites' })).toHaveAttribute('aria-busy', 'false');
      expect(screen.getByRole('button')).toBeEnabled();
      expect(screen.getByRole('status')).toHaveTextContent('Saved Hades to favorites.');
      expect(screen.getByRole('status')).not.toHaveTextContent('Saving');
   });

   it('announces session checking and prevents a save until auth is ready', async () => {
      renderWithProviders(<SaveGameAction game={game} />, { auth: { isAuthReady: false } });
      const button = screen.getByRole('button', { name: 'Checking session for Hades' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      expect(screen.getByRole('status')).toHaveTextContent('Checking session for Hades');
      await userEvent.setup().click(button);
      expect(upsertUserFavorite).not.toHaveBeenCalled();
   });

   it('exposes delayed removal and restores idle state after failure', async () => {
      let failRemove!: (reason: Error) => void;
      vi.mocked(removeUserFavorite).mockReturnValue(new Promise<void>((_, reject) => { failRemove = reject; }));
      renderWithProviders(<SaveGameAction game={game} />, {
         auth: { currentUser },
         preloadedFavorites: { ids: [game.id], entities: { [game.id]: game }, status: 'ready' },
      });
      await userEvent.setup().click(screen.getByRole('button', { name: 'Remove Hades from favorites' }));
      expect(screen.getByRole('button', { name: 'Removing Hades from favorites' })).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toHaveTextContent('Removing Hades from favorites');
      await act(async () => failRemove(new Error('Unavailable')));
      expect(screen.getByRole('button', { name: 'Remove Hades from favorites' })).toHaveAttribute('aria-busy', 'false');
      expect(screen.getByRole('button')).toBeEnabled();
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to remove this game right now.');
   });
});
