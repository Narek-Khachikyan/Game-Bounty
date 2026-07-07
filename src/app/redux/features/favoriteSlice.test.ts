import { describe, expect, it } from 'vitest';
import favoritesReducer, {
   addItem,
   clearFavorites,
   removeItem,
   replaceFavorites,
   resetFavoritesState,
   setFavoritesStatus,
   startFavoritesSync,
} from './favoriteSlice';
import { createGame } from '../../../test/factories';

describe('favoriteSlice', () => {
   it('starts from an idle empty state', () => {
      expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual({
         ids: [],
         entities: {},
         status: 'idle',
      });
   });

   it('marks sync as loading and clears stale favorites', () => {
      const existingGame = createGame();
      const readyState = favoritesReducer(undefined, replaceFavorites([existingGame]));

      expect(favoritesReducer(readyState, startFavoritesSync())).toEqual({
         ids: [],
         entities: {},
         status: 'loading',
      });
   });

   it('replaces favorites with normalized entities', () => {
      const hades = createGame();
      const celeste = createGame({ id: 99, name: 'Celeste', metacritic: 92 });

      expect(favoritesReducer(undefined, replaceFavorites([hades, celeste]))).toEqual({
         ids: [42, 99],
         entities: {
            42: hades,
            99: celeste,
         },
         status: 'ready',
      });
   });

   it('adds a favorite once and ignores duplicates', () => {
      const hades = createGame();
      const withFavorite = favoritesReducer(undefined, addItem(hades));

      expect(favoritesReducer(withFavorite, addItem(hades))).toEqual({
         ids: [42],
         entities: {
            42: hades,
         },
         status: 'ready',
      });
   });

   it('removes a favorite without affecting missing ids', () => {
      const hades = createGame();
      const celeste = createGame({ id: 99, name: 'Celeste' });
      const readyState = favoritesReducer(undefined, replaceFavorites([hades, celeste]));
      const afterMissingRemove = favoritesReducer(readyState, removeItem(123));

      expect(afterMissingRemove).toBe(readyState);
      expect(favoritesReducer(readyState, removeItem(42))).toEqual({
         ids: [99],
         entities: {
            99: celeste,
         },
         status: 'ready',
      });
   });

   it('clears and resets favorites state deliberately', () => {
      const readyState = favoritesReducer(undefined, replaceFavorites([createGame()]));

      expect(favoritesReducer(readyState, clearFavorites())).toEqual({
         ids: [],
         entities: {},
         status: 'ready',
      });
      expect(favoritesReducer(readyState, resetFavoritesState())).toEqual({
         ids: [],
         entities: {},
         status: 'idle',
      });
   });

   it('tracks explicit sync errors', () => {
      const loadingState = favoritesReducer(undefined, startFavoritesSync());

      expect(favoritesReducer(loadingState, setFavoritesStatus('error'))).toEqual({
         ids: [],
         entities: {},
         status: 'error',
      });
   });
});
