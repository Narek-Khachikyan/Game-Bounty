import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
   Games,
   Genres,
   GamesInfo,
   PlatformsData,
   ScreenShots,
   GameDlc,
   SameSeriesGame,
} from '../../../@types/types';

const api = '1bc8a2cdaf9b4ba49e0e798f5113a1dc';

export const gameApi = createApi({
   reducerPath: 'gameApi',
   baseQuery: fetchBaseQuery({
      baseUrl: 'https://api.rawg.io/api',
   }),
   endpoints: (builder) => ({
      getGamesData: builder.query<
         Games,
         { filterByGenres: string; debouncedQuery: string; filterByPlatforms: number }
      >({
         query: ({ filterByGenres, debouncedQuery, filterByPlatforms }) =>
            `/games?key=${api}&genres=${filterByGenres}&platforms=${filterByPlatforms}&search=${debouncedQuery}`,
      }),
      getGamesInfoData: builder.query<GamesInfo, string>({
         query: (id) => `/games/${id}?key=${api}`,
      }),
      getGenresData: builder.query<Genres, string>({
         query: () => `/genres?key=${api}`,
      }),
      getPlatformsData: builder.query<PlatformsData, string>({
         query: () => `/platforms?key=${api}`,
      }),
      getScreenShots: builder.query<ScreenShots, string>({
         query: (id) => `/games/${id}/screenshots?key=${api}`,
      }),
      getDlcData: builder.query<GameDlc, string>({
         query: (id) => `/games/${id}/additions?key=${api}`,
      }),
      getSameSeries: builder.query<SameSeriesGame, string>({
         query: (id) => `/games/${id}/game-series?key=${api}`,
      }),
   }),
});

export const {
   useGetGamesDataQuery,
   useGetGenresDataQuery,
   useGetGamesInfoDataQuery,
   useGetPlatformsDataQuery,
   useGetScreenShotsQuery,
   useGetDlcDataQuery,
   useGetSameSeriesQuery,
} = gameApi;
