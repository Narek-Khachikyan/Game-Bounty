import {
   collection,
   deleteDoc,
   doc,
   type FieldValue,
   onSnapshot,
   setDoc,
   serverTimestamp,
   Timestamp,
} from 'firebase/firestore';
import type { GameData } from '../@types/types';
import { firebaseDb } from './firebase';

const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';

type PlatformEntry = GameData['platforms'][number];

type FavoriteDocumentWrite = GameData & {
   savedAt: FieldValue;
};

type FavoriteDocumentRead = Omit<GameData, 'platforms'> & {
   platforms: unknown[];
   savedAt?: number | Timestamp | null;
};

type NormalizedFavorite = {
   game: GameData;
   savedAtMillis: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
   typeof value === 'object' && value !== null;

const isPlatformEntry = (value: unknown): value is PlatformEntry => {
   if (!isRecord(value)) {
      return false;
   }

   const platform = value.platform;
   if (!isRecord(platform)) {
      return false;
   }

   return typeof platform.id === 'number' && typeof platform.name === 'string';
};

const normalizePlatformEntry = (value: unknown): PlatformEntry | null => {
   if (!isPlatformEntry(value)) {
      return null;
   }

   return {
      platform: {
         id: value.platform.id,
         name: value.platform.name,
      },
   };
};

const hasFavoriteDocumentFields = (value: unknown): value is FavoriteDocumentRead => {
   if (!isRecord(value)) {
      return false;
   }

   return (
      typeof value.id === 'number' &&
      typeof value.name === 'string' &&
      typeof value.released === 'string' &&
      typeof value.background_image === 'string' &&
      (typeof value.metacritic === 'number' || value.metacritic === null) &&
      Array.isArray(value.platforms)
   );
};

const normalizeSavedAtMillis = (value: FavoriteDocumentRead['savedAt']) => {
   if (value instanceof Timestamp) {
      return value.toMillis();
   }

   return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const normalizeFavoriteDocument = (value: unknown): NormalizedFavorite | null => {
   if (!hasFavoriteDocumentFields(value)) {
      return null;
   }

   const platforms = value.platforms
      .map((platformEntry) => normalizePlatformEntry(platformEntry))
      .filter((platformEntry): platformEntry is PlatformEntry => platformEntry !== null);

   return {
      game: {
         id: value.id,
         name: value.name,
         released: value.released,
         background_image: value.background_image,
         metacritic: value.metacritic,
         platforms,
      },
      // Keep legacy favorites visible even if their stored timestamp is malformed.
      savedAtMillis: normalizeSavedAtMillis(value.savedAt),
   };
};

const sanitizeGameData = (game: GameData): GameData => ({
   ...game,
   platforms: game.platforms
      .map((platformEntry) => normalizePlatformEntry(platformEntry))
      .filter((platformEntry): platformEntry is PlatformEntry => platformEntry !== null),
});

const getFavoritesCollection = (userId: string) =>
   collection(firebaseDb, USERS_COLLECTION, userId, FAVORITES_COLLECTION);

const getFavoriteDocument = (userId: string, gameId: number) =>
   doc(getFavoritesCollection(userId), String(gameId));

export const subscribeToUserFavorites = (
   userId: string,
   onFavoritesChange: (favorites: GameData[]) => void,
   onError?: () => void,
) => {
   return onSnapshot(
      getFavoritesCollection(userId),
      (snapshot) => {
         const favorites = snapshot.docs
            .map((favoriteDocument) =>
               normalizeFavoriteDocument(
                  favoriteDocument.data({ serverTimestamps: 'estimate' }) as unknown,
               ),
            )
            .filter((favorite): favorite is NormalizedFavorite => favorite !== null)
            .sort((left, right) => left.savedAtMillis - right.savedAtMillis)
            .map((favorite) => favorite.game);

         onFavoritesChange(favorites);
      },
      () => {
         onError?.();
      },
   );
};

export const upsertUserFavorite = async (userId: string, game: GameData) => {
   const favoriteDocument: FavoriteDocumentWrite = {
      ...sanitizeGameData(game),
      savedAt: serverTimestamp(),
   };

   await setDoc(getFavoriteDocument(userId, game.id), favoriteDocument);
};

export const removeUserFavorite = async (userId: string, gameId: number) => {
   await deleteDoc(getFavoriteDocument(userId, gameId));
};

export const clearUserFavorites = async (userId: string, favoriteIds: number[]) => {
   await Promise.all(favoriteIds.map((favoriteId) => removeUserFavorite(userId, favoriteId)));
};
