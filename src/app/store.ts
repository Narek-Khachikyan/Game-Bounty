import { configureStore } from '@reduxjs/toolkit';
import { gameApi } from './redux/features/apiSlice';
import favoriteSlice from './redux/features/favoriteSlice';
import type { FavoritesState } from './redux/features/favoriteSlice';
import type { GameData } from '../@types/types';

const FAVORITES_STORAGE_KEY = 'game-bounty:favorites:v1';
const FAVORITES_PERSIST_DEBOUNCE_MS = 300;

const isRecord = (value: unknown): value is Record<string, unknown> =>
   typeof value === 'object' && value !== null;

const isPlatformEntry = (value: unknown): boolean => {
   if (!isRecord(value)) {
      return false;
   }

   const platform = value.platform;
   if (!isRecord(platform)) {
      return false;
   }

   return typeof platform.id === 'number' && typeof platform.name === 'string';
};

const isGameData = (value: unknown): value is GameData => {
   if (!isRecord(value)) {
      return false;
   }

   return (
      typeof value.id === 'number' &&
      typeof value.name === 'string' &&
      typeof value.released === 'string' &&
      typeof value.background_image === 'string' &&
      (typeof value.metacritic === 'number' || value.metacritic === null) &&
      Array.isArray(value.platforms) &&
      value.platforms.every(isPlatformEntry)
   );
};

const isFavoritesState = (value: unknown): value is FavoritesState => {
   if (!isRecord(value)) {
      return false;
   }

   const ids = value.ids;
   const entities = value.entities;

   if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'number')) {
      return false;
   }

   if (!isRecord(entities)) {
      return false;
   }

   return ids.every((id) => isGameData(entities[id]));
};

const loadFavoritesFromStorage = (): { favorites: FavoritesState } | undefined => {
   if (typeof window === 'undefined') {
      return undefined;
   }

   try {
      const rawFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!rawFavorites) {
         return undefined;
      }

      const parsed = JSON.parse(rawFavorites) as unknown;
      if (!isFavoritesState(parsed)) {
         return undefined;
      }

      return { favorites: parsed };
   } catch {
      return undefined;
   }
};

const saveFavoritesToStorage = (favorites: FavoritesState) => {
   if (typeof window === 'undefined') {
      return;
   }

   try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
   } catch {
      // Ignore write errors (e.g., quota exceeded) to avoid breaking app flow.
   }
};

const preloadedState = loadFavoritesFromStorage();

const store = configureStore({
   reducer: {
      [gameApi.reducerPath]: gameApi.reducer,
      favorites: favoriteSlice,
   },
   preloadedState,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});

let previousFavoritesState = store.getState().favorites;
let persistTimeout: ReturnType<typeof setTimeout> | undefined;

store.subscribe(() => {
   const nextFavoritesState = store.getState().favorites;

   if (nextFavoritesState === previousFavoritesState) {
      return;
   }

   previousFavoritesState = nextFavoritesState;

   if (persistTimeout) {
      clearTimeout(persistTimeout);
   }

   persistTimeout = setTimeout(() => {
      saveFavoritesToStorage(nextFavoritesState);
   }, FAVORITES_PERSIST_DEBOUNCE_MS);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
