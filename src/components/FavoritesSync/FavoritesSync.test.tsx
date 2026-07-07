import { describe, expect, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import FavoritesSync from './FavoritesSync';
import { renderWithProviders } from '../../test/renderWithProviders';
import { createGame } from '../../test/factories';
import { subscribeToUserFavorites } from '../../lib/userFavorites';

vi.mock('../../lib/userFavorites', () => ({
   subscribeToUserFavorites: vi.fn(),
}));

const mockedSubscribeToUserFavorites = vi.mocked(subscribeToUserFavorites);

describe('FavoritesSync', () => {
   it('waits until auth is ready before syncing', () => {
      const { store } = renderWithProviders(<FavoritesSync />, {
         auth: {
            isAuthReady: false,
         },
      });

      expect(mockedSubscribeToUserFavorites).not.toHaveBeenCalled();
      expect(store.getState().favorites.status).toBe('idle');
   });

   it('resets favorites for signed-out users', () => {
      const { store } = renderWithProviders(<FavoritesSync />, {
         preloadedFavorites: {
            ids: [42],
            entities: {
               42: createGame(),
            },
            status: 'ready',
         },
      });

      expect(store.getState().favorites).toEqual({
         ids: [],
         entities: {},
         status: 'idle',
      });
   });

   it('subscribes signed-in users and mirrors snapshots into Redux', async () => {
      const unsubscribe = vi.fn();
      const favorite = createGame();
      mockedSubscribeToUserFavorites.mockImplementation((_userId, onFavoritesChange) => {
         onFavoritesChange([favorite]);
         return unsubscribe;
      });

      const { store, unmount } = renderWithProviders(<FavoritesSync />, {
         auth: {
            currentUser: { uid: 'alice' } as never,
         },
      });

      await waitFor(() => expect(store.getState().favorites.status).toBe('ready'));
      expect(mockedSubscribeToUserFavorites).toHaveBeenCalledWith(
         'alice',
         expect.any(Function),
         expect.any(Function),
      );
      expect(store.getState().favorites.ids).toEqual([42]);

      unmount();
      expect(unsubscribe).toHaveBeenCalled();
   });

   it('keeps an explicit error status when the subscription fails', async () => {
      mockedSubscribeToUserFavorites.mockImplementation((_userId, _onFavoritesChange, onError) => {
         onError?.();
         return vi.fn();
      });

      const { store } = renderWithProviders(<FavoritesSync />, {
         auth: {
            currentUser: { uid: 'alice' } as never,
         },
      });

      await waitFor(() => expect(store.getState().favorites.status).toBe('error'));
   });
});
