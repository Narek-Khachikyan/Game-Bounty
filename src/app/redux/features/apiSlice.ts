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

type CatalogQuery = {
   filterByGenres: string;
   debouncedQuery: string;
   filterByPlatforms: number;
   page?: number;
};

const normalizeCatalogQuery = ({ filterByGenres, debouncedQuery, filterByPlatforms, page = 1 }: CatalogQuery) => ({
   filterByGenres: filterByGenres.trim(),
   debouncedQuery: debouncedQuery.trim(),
   filterByPlatforms,
   page,
});

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
   keepUnusedDataFor: 300,
   endpoints: (builder) => ({
      getGamesData: builder.query<
         Games,
         CatalogQuery
      >({
         serializeQueryArgs: ({ queryArgs }) => normalizeCatalogQuery(queryArgs),
         query: (args) => {
            const { filterByGenres, debouncedQuery, filterByPlatforms, page } = normalizeCatalogQuery(args);
            const params = new URLSearchParams({
               page_size: '12',
               page: String(page),
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
         keepUnusedDataFor: 3600,
      }),
      getPlatformsData: builder.query<PlatformsData, void>({
         query: () => `/platforms`,
         keepUnusedDataFor: 3600,
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
