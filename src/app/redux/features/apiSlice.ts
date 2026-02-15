import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type {
   Games,
   Genres,
   GamesInfo,
   PlatformsData,
   ScreenShots,
   GameDlc,
   SameSeriesGame,
} from '../../../@types/types';

const api = import.meta.env.VITE_API_KEY;
export const MISSING_API_KEY_ERROR = 'Missing VITE_API_KEY. Add it to your environment file.';
const htmlTagPattern = /(<([^>]+)>)/gi;

const rawgBaseQuery = fetchBaseQuery({
   baseUrl: 'https://api.rawg.io/api',
});

const guardedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
   args,
   apiContext,
   extraOptions,
) => {
   if (!api) {
      return {
         error: {
            status: 'CUSTOM_ERROR',
            error: MISSING_API_KEY_ERROR,
         },
      };
   }

   return rawgBaseQuery(args, apiContext, extraOptions);
};

export const isMissingApiKeyError = (error: unknown): boolean => {
   if (!error || typeof error !== 'object') {
      return false;
   }

   const customError = error as { status?: unknown; error?: unknown };
   return customError.status === 'CUSTOM_ERROR' && customError.error === MISSING_API_KEY_ERROR;
};

const normalizeGameDescription = (description: string): string =>
   description.replace(htmlTagPattern, '');

export const gameApi = createApi({
   reducerPath: 'gameApi',
   baseQuery: guardedBaseQuery,
   endpoints: (builder) => ({
      getGamesData: builder.query<
         Games,
         { filterByGenres: string; debouncedQuery: string; filterByPlatforms: number }
      >({
         query: ({ filterByGenres, debouncedQuery, filterByPlatforms }) => {
            const params = new URLSearchParams({
               key: `${api}`,
               page_size: '12',
            });

            if (filterByGenres.trim()) {
               params.set('genres', filterByGenres);
            }
            if (filterByPlatforms) {
               params.set('platforms', String(filterByPlatforms));
            }
            if (debouncedQuery.trim()) {
               params.set('search', debouncedQuery);
            }

            return `/games?${params.toString()}`;
         },
      }),
      getGamesInfoData: builder.query<GamesInfo, string>({
         query: (id) => `/games/${id}?key=${api}`,
         transformResponse: (response: GamesInfo) => ({
            ...response,
            description: normalizeGameDescription(response.description),
         }),
      }),
      getGenresData: builder.query<Genres, void>({
         query: () => `/genres?key=${api}`,
      }),
      getPlatformsData: builder.query<PlatformsData, void>({
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
