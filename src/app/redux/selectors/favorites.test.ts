import { describe, expect, it } from 'vitest';
import type { RootState } from '../../store';
import { gameApi } from '../features/apiSlice';
import {
   selectFavoritesCount,
   selectFavoritesList,
   selectFavoritesStatus,
   selectIsFavorite,
} from './favorites';
import { createGame } from '../../../test/factories';

const createState = (favoriteIds: number[] = []): RootState => {
   const games = favoriteIds.map((id) => createGame({ id, name: `Game ${id}` }));

   return {
      [gameApi.reducerPath]: gameApi.reducer(undefined, { type: 'test/init' }),
      favorites: {
         ids: favoriteIds,
         entities: Object.fromEntries(games.map((game) => [game.id, game])),
         status: 'ready',
      },
   } as RootState;
};

describe('favorites selectors', () => {
   it('returns favorites in saved order', () => {
      const state = createState([99, 42]);

      expect(selectFavoritesList(state).map((game) => game.id)).toEqual([99, 42]);
   });

   it('filters out stale ids without matching entities', () => {
      const state = createState([99, 42]);
      delete state.favorites.entities[42];

      expect(selectFavoritesList(state).map((game) => game.id)).toEqual([99]);
   });

   it('selects count status and item membership', () => {
      const state = createState([42]);

      expect(selectFavoritesCount(state)).toBe(1);
      expect(selectFavoritesStatus(state)).toBe('ready');
      expect(selectIsFavorite(42)(state)).toBe(true);
      expect(selectIsFavorite(99)(state)).toBe(false);
   });
});
