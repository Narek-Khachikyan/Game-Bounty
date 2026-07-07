import type { PropsWithChildren, ReactElement } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { gameApi } from '../app/redux/features/apiSlice';
import favoritesReducer from '../app/redux/features/favoriteSlice';
import { AuthContext, type AuthContextValue } from '../context/authContext';

type RenderOptions = {
   auth?: Partial<AuthContextValue>;
   route?: string;
   preloadedFavorites?: ReturnType<typeof favoritesReducer>;
};

const createAuthValue = (overrides: Partial<AuthContextValue> = {}): AuthContextValue => ({
   currentUser: null,
   isAuthReady: true,
   isWorking: false,
   signInWithEmail: async () => undefined,
   signUpWithEmail: async () => undefined,
   signInWithGoogle: async () => undefined,
   signOutCurrentUser: async () => undefined,
   ...overrides,
});

export const createTestStore = (preloadedFavorites?: ReturnType<typeof favoritesReducer>) =>
   configureStore({
      reducer: {
         [gameApi.reducerPath]: gameApi.reducer,
         favorites: favoritesReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
      preloadedState: preloadedFavorites
         ? {
              favorites: preloadedFavorites,
           }
         : undefined,
   });

export const renderWithProviders = (
   ui: ReactElement,
   { auth, route = '/', preloadedFavorites }: RenderOptions = {},
) => {
   const store = createTestStore(preloadedFavorites);

   const Wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>
         <AuthContext.Provider value={createAuthValue(auth)}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
         </AuthContext.Provider>
      </Provider>
   );

   return {
      store,
      ...render(ui, { wrapper: Wrapper }),
   };
};
