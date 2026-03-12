import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';

export interface CartState {
   items: GameData[];
   count: number;
}

const initialState: CartState = {
   items: [],
   count: 0,
};

const favoritesSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      addItem: (state: CartState, action: PayloadAction<GameData>) => {
         state.items.push(action.payload);
         state.count++;
      },
      removeItem: (state, action: PayloadAction<number>) => {
         state.items = state.items.filter((item) => item.id !== action.payload);
         state.count--;
      },
      clearFavorites: (state: CartState) => {
         state.items = [];
         state.count = 0;
      },
   },
});

export const { addItem, removeItem, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
