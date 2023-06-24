import { configureStore } from '@reduxjs/toolkit';
import { gameApi } from './redux/features/apiSlice';

const store = configureStore({
   reducer: {
      [gameApi.reducerPath]: gameApi.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
