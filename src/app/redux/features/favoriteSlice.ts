import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';

export interface FavoritesState {
   ids: number[];
   entities: Record<number, GameData>;
}

const initialState: FavoritesState = {
   ids: [],
   entities: {},
};

const favoritesSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      addItem: (state, action: PayloadAction<GameData>) => {
         const gameId = action.payload.id;
         if (state.entities[gameId]) {
            return;
         }

         state.ids.push(gameId);
         state.entities[gameId] = action.payload;
      },
      removeItem: (state, action: PayloadAction<number>) => {
         const gameId = action.payload;
         if (!state.entities[gameId]) {
            return;
         }

         delete state.entities[gameId];
         state.ids = state.ids.filter((id) => id !== gameId);
      },
      clearFavorites: (state) => {
         state.ids = [];
         state.entities = {};
      },
   },
});

export const { addItem, removeItem, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
