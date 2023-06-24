import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Games } from '../../../@types/types';

const api = '1bc8a2cdaf9b4ba49e0e798f5113a1dc';

export const gameApi = createApi({
   reducerPath: 'pokemonApi',
   baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.rawg.io/api',
   }),
   endpoints: (builder) => ({
      getGamesData: builder.query<Games, string>({
         query: () => `/games?key=${api}`,
      }),
   }),
});

export const { useGetGamesDataQuery } = gameApi;
