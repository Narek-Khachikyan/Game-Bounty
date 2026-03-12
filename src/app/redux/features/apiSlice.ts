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

type RawgProxyErrorData = {
   code?: string;
   message?: string;
};

export const RAWG_PROXY_CONFIGURATION_ERROR_CODE = 'MISSING_RAWG_API_KEY';
export const RAWG_PROXY_CONFIGURATION_ERROR_MESSAGE =
   'Missing RAWG_API_KEY. Add it to the server environment and restart the app.';
const htmlTagPattern = /(<([^>]+)>)/gi;

const rawgBaseQuery = fetchBaseQuery({
   baseUrl: '/api/rawg',
});

const guardedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
   args,
   apiContext,
   extraOptions,
) => {
   return rawgBaseQuery(args, apiContext, extraOptions);
};

export const isRawgProxyConfigurationError = (error: unknown): boolean => {
   if (!error || typeof error !== 'object') {
      return false;
   }

   const proxyError = error as { status?: unknown; data?: RawgProxyErrorData };
   return (
      proxyError.status === 500 &&
      proxyError.data?.code === RAWG_PROXY_CONFIGURATION_ERROR_CODE
   );
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
         query: (id) => `/games/${id}`,
         transformResponse: (response: GamesInfo) => ({
            ...response,
            description: normalizeGameDescription(response.description),
         }),
      }),
      getGenresData: builder.query<Genres, void>({
         query: () => `/genres`,
      }),
      getPlatformsData: builder.query<PlatformsData, void>({
         query: () => `/platforms`,
      }),
      getScreenShots: builder.query<ScreenShots, string>({
         query: (id) => `/games/${id}/screenshots`,
      }),
      getDlcData: builder.query<GameDlc, string>({
         query: (id) => `/games/${id}/additions`,
      }),
      getSameSeries: builder.query<SameSeriesGame, string>({
         query: (id) => `/games/${id}/game-series`,
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
