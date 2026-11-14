// @vitest-environment node
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gameApi } from './apiSlice';

const createStore = () => configureStore({
   reducer: { [gameApi.reducerPath]: gameApi.reducer },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});

let store: ReturnType<typeof createStore>;
const request = vi.fn();

beforeEach(() => {
   request.mockReset();
   request.mockImplementation(() => Promise.resolve(new Response(JSON.stringify({
      results: [], count: 24, next: '/games?page=2', previous: null,
   }), { headers: { 'Content-Type': 'application/json' } })));
   vi.stubGlobal('fetch', request);
   // Browsers resolve same-origin Request URLs; Node's Request requires an absolute URL.
   const NativeRequest = globalThis.Request;
   vi.stubGlobal('Request', class extends NativeRequest {
      constructor(input: RequestInfo | URL, init?: RequestInit) {
         super(typeof input === 'string' ? new URL(input, 'https://catalog.test') : input, init);
      }
   });
   store = createStore();
});

afterEach(() => {
   store.dispatch(gameApi.util.resetApiState());
   vi.useRealTimers();
   vi.unstubAllGlobals();
});

describe('catalog pagination transport', () => {
   it('defaults existing callers to page one and retains continuation metadata', async () => {
      const data = await store.dispatch(gameApi.endpoints.getGamesData.initiate({
         filterByGenres: '', debouncedQuery: '', filterByPlatforms: 0,
      })).unwrap();

      const url = new URL((request.mock.calls[0][0] as Request).url);
      expect(url.pathname).toBe('/api/rawg/games');
      expect(Object.fromEntries(url.searchParams)).toEqual({ page_size: '12', page: '1' });
      expect(data).toMatchObject({ count: 24, next: '/games?page=2', previous: null });
   });

   it('requests distinct pages without dropping search or filters', async () => {
      const filters = { filterByGenres: 'rpg', debouncedQuery: 'wild hunt', filterByPlatforms: 4 };
      await store.dispatch(gameApi.endpoints.getGamesData.initiate({ ...filters, page: 1 })).unwrap();
      await store.dispatch(gameApi.endpoints.getGamesData.initiate({ ...filters, page: 2 })).unwrap();

      expect(request).toHaveBeenCalledTimes(2);
      const url = new URL((request.mock.calls[1][0] as Request).url);
      expect(Object.fromEntries(url.searchParams)).toEqual({
         page_size: '12', page: '2', genres: 'rpg', platforms: '4', search: 'wild hunt',
      });
   });
});


describe('API request reuse', () => {
   it('shares cache entries for whitespace and implicit page one', async () => {
      await store.dispatch(gameApi.endpoints.getGamesData.initiate({
         filterByGenres: ' rpg ', debouncedQuery: ' wild hunt ', filterByPlatforms: 4,
      })).unwrap();
      await store.dispatch(gameApi.endpoints.getGamesData.initiate({
         filterByGenres: 'rpg', debouncedQuery: 'wild hunt', filterByPlatforms: 4, page: 1,
      })).unwrap();

      expect(request).toHaveBeenCalledTimes(1);
      const url = new URL((request.mock.calls[0][0] as Request).url);
      expect(url.searchParams.get('search')).toBe('wild hunt');
      expect(url.searchParams.get('genres')).toBe('rpg');
   });

   it.each(['getGamesData', 'getGenresData', 'getPlatformsData'] as const)(
      'reuses %s after a two-minute visit elsewhere and expires it eventually', async (endpoint) => {
         const initiate = () => endpoint === 'getGamesData'
            ? store.dispatch(gameApi.endpoints.getGamesData.initiate({
               filterByGenres: '', debouncedQuery: '', filterByPlatforms: 0,
            }))
            : endpoint === 'getGenresData'
               ? store.dispatch(gameApi.endpoints.getGenresData.initiate())
               : store.dispatch(gameApi.endpoints.getPlatformsData.initiate());
         const first = initiate();
         await first.unwrap();
         vi.useFakeTimers();
         first.unsubscribe();
         await vi.advanceTimersByTimeAsync(120_000);
         vi.useRealTimers();
         const second = initiate();
         await second.unwrap();
         expect(request).toHaveBeenCalledTimes(1);
         vi.useFakeTimers();
         second.unsubscribe();
         await vi.advanceTimersByTimeAsync((endpoint === 'getGamesData' ? 300 : 3600) * 1000 + 1);
         vi.useRealTimers();
         await initiate().unwrap();
         expect(request).toHaveBeenCalledTimes(2);
      },
   );
});
