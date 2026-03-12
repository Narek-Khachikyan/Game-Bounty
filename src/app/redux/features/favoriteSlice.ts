import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';

export type FavoritesStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface FavoritesState {
   ids: number[];
   entities: Record<number, GameData>;
   status: FavoritesStatus;
}

const createInitialState = (): FavoritesState => ({
   ids: [],
   entities: {},
   status: 'idle',
});

const createEntities = (favorites: GameData[]) =>
   favorites.reduce<Record<number, GameData>>((entities, favorite) => {
      entities[favorite.id] = favorite;
      return entities;
   }, {});

const initialState = createInitialState();

const favoritesSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      startFavoritesSync: (state) => {
         state.ids = [];
         state.entities = {};
         state.status = 'loading';
      },
      replaceFavorites: (state, action: PayloadAction<GameData[]>) => {
         state.ids = action.payload.map((favorite) => favorite.id);
         state.entities = createEntities(action.payload);
         state.status = 'ready';
      },
      setFavoritesStatus: (state, action: PayloadAction<FavoritesStatus>) => {
         state.status = action.payload;
      },
      resetFavoritesState: () => createInitialState(),
      addItem: (state, action: PayloadAction<GameData>) => {
         const gameId = action.payload.id;
         if (state.entities[gameId]) {
            return;
         }

         state.ids.push(gameId);
         state.entities[gameId] = action.payload;
         state.status = 'ready';
      },
      removeItem: (state, action: PayloadAction<number>) => {
         const gameId = action.payload;
         if (!state.entities[gameId]) {
            return;
         }

         delete state.entities[gameId];
         state.ids = state.ids.filter((id) => id !== gameId);
         state.status = 'ready';
      },
      clearFavorites: (state) => {
         state.ids = [];
         state.entities = {};
         state.status = 'ready';
      },
   },
});

export const {
   addItem,
   clearFavorites,
   removeItem,
   replaceFavorites,
   resetFavoritesState,
   setFavoritesStatus,
   startFavoritesSync,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
