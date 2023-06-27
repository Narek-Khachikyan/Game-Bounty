import { configureStore } from '@reduxjs/toolkit';
import { gameApi } from './redux/features/apiSlice';
import favoriteSlice from './redux/features/favoriteSlice';

const store = configureStore({
   reducer: {
      [gameApi.reducerPath]: gameApi.reducer,
      favorites: favoriteSlice,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
