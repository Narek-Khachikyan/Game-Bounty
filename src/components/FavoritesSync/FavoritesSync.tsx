import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
   replaceFavorites,
   resetFavoritesState,
   setFavoritesStatus,
   startFavoritesSync,
} from '../../app/redux/features/favoriteSlice';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToUserFavorites } from '../../lib/userFavorites';

const FavoritesSync = () => {
   const dispatch = useAppDispatch();
   const { currentUser, isAuthReady } = useAuth();

   useEffect(() => {
      if (!isAuthReady) {
         return undefined;
      }

      if (!currentUser) {
         dispatch(resetFavoritesState());
         return undefined;
      }

      dispatch(startFavoritesSync());

      const unsubscribe = subscribeToUserFavorites(
         currentUser.uid,
         (favorites) => {
            dispatch(replaceFavorites(favorites));
         },
         () => {
            dispatch(setFavoritesStatus('error'));
         },
      );

      return unsubscribe;
   }, [currentUser, dispatch, isAuthReady]);

   return null;
};

export default FavoritesSync;
