import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';

export interface FavoritesState {
   items: GameData[];
   count: number;
}

const initialState: FavoritesState = {
   items: [],
   count: 0,
};

const favoritesSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      addItem: (state: FavoritesState, action: PayloadAction<GameData>) => {
         const exists = state.items.some((item) => item.id === action.payload.id);
         if (!exists) {
            state.items.push(action.payload);
         }
         state.count = state.items.length;
      },
      removeItem: (state, action: PayloadAction<number>) => {
         state.items = state.items.filter((item) => item.id !== action.payload);
         state.count = state.items.length;
      },
      clearFavorites: (state: FavoritesState) => {
         state.items = [];
         state.count = 0;
      },
   },
});

export const { addItem, removeItem, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
