import {
   collection,
   deleteDoc,
   doc,
   onSnapshot,
   orderBy,
   query,
   setDoc,
} from 'firebase/firestore';
import type { GameData } from '../@types/types';
import { firebaseDb } from './firebase';

const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';

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

const getFavoritesCollection = (userId: string) =>
   collection(firebaseDb, USERS_COLLECTION, userId, FAVORITES_COLLECTION);

const getFavoriteDocument = (userId: string, gameId: number) =>
   doc(getFavoritesCollection(userId), String(gameId));

export const subscribeToUserFavorites = (
   userId: string,
   onFavoritesChange: (favorites: GameData[]) => void,
   onError?: () => void,
) => {
   const favoritesQuery = query(getFavoritesCollection(userId), orderBy('savedAt', 'asc'));

   return onSnapshot(
      favoritesQuery,
      (snapshot) => {
         const favorites = snapshot.docs
            .map((favoriteDocument) => favoriteDocument.data() as unknown)
            .filter((favorite): favorite is GameData => isGameData(favorite));

         onFavoritesChange(favorites);
      },
      () => {
         onError?.();
      },
   );
};

export const upsertUserFavorite = async (userId: string, game: GameData) => {
   await setDoc(getFavoriteDocument(userId, game.id), {
      ...game,
      savedAt: Date.now(),
   });
};

export const removeUserFavorite = async (userId: string, gameId: number) => {
   await deleteDoc(getFavoriteDocument(userId, gameId));
};

export const clearUserFavorites = async (userId: string, favoriteIds: number[]) => {
   await Promise.all(favoriteIds.map((favoriteId) => removeUserFavorite(userId, favoriteId)));
};
