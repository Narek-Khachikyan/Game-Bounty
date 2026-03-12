import { createSelector } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';
import type { RootState } from '../../store';

const selectFavoritesState = (state: RootState) => state.favorites;

const selectFavoriteIds = createSelector([selectFavoritesState], (favorites) => favorites.ids);
const selectFavoriteEntities = createSelector(
   [selectFavoritesState],
   (favorites) => favorites.entities,
);

export const selectFavoritesStatus = createSelector(
   [selectFavoritesState],
   (favorites) => favorites.status,
);

export const selectFavoritesList = createSelector(
   [selectFavoriteIds, selectFavoriteEntities],
   (ids, entities) =>
      ids
         .map((id) => entities[id])
         .filter((item): item is GameData => Boolean(item)),
);

export const selectFavoritesCount = createSelector([selectFavoriteIds], (ids) => ids.length);

export const selectIsFavorite = (id: number) => (state: RootState) =>
   Boolean(state.favorites.entities[id]);
