import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameData } from '../../../@types/types';

interface CartState {
   items: GameData[];
}

const initialState: CartState = {
   items: [],
};

const favoritesSlice = createSlice({
   name: 'favorites',
   initialState,
   reducers: {
      addItem: (state, action: PayloadAction<GameData>) => {
         state.items.push(action.payload);
      },
      removeItem(state, action: PayloadAction<number>) {
         state.items = state.items.filter((item) => item.id !== action.payload);
      },
      clearFavorites: (state) => {
         state.items = [];
      },
   },
});

export const { addItem, removeItem, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
