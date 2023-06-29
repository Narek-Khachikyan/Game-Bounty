import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Games, Genres, GamesInfo } from '../../../@types/types';

const api = '1bc8a2cdaf9b4ba49e0e798f5113a1dc';

export const gameApi = createApi({
   reducerPath: 'gameApi',
   baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.rawg.io/api',
   }),
   endpoints: (builder) => ({
      getGamesData: builder.query<Games, string>({
         query: (filterByGenres) => `/games?key=${api}&genres=${filterByGenres}`,
      }),
      getGamesInfoData: builder.query<GamesInfo, string>({
         query: (id) => `/games/${id}?key=${api}`,
      }),
      getGenresData: builder.query<Genres, string>({
         query: () => `/genres?key=${api}`,
      }),
   }),
});

export const { useGetGamesDataQuery, useGetGenresDataQuery, useGetGamesInfoDataQuery } = gameApi;
