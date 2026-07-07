import { useParams, useSearchParams } from 'react-router-dom';
import {
   isRawgProxyConfigurationError,
   useGetDlcDataQuery,
   useGetGamesInfoDataQuery,
   useGetSameSeriesQuery,
   useGetScreenShotsQuery,
} from '../app/redux/features/apiSlice';
import '../components/GameCardInfo/gamesInfoCard.scss';
import achivments from '../assets/achivments.png';
import { GamesInfoCardSkelton } from '../components/Skeleton/Skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import GameContentPlan from '../components/GameContentPlan/GameContentPlan';

const GameDetails = () => {
   const { id } = useParams();
   const [searchParams] = useSearchParams();
   const gameId = id ?? '';
   const shouldSkip = !gameId;
   const selectedPlatformParam = searchParams.get('platform');
   const parsedSelectedPlatformId = Number(selectedPlatformParam);
   const selectedPlatformId =
      Number.isInteger(parsedSelectedPlatformId) && parsedSelectedPlatformId > 0
         ? parsedSelectedPlatformId
         : null;
   const {
      data: gamesInfoData,
      isLoading: gamesInfoDataLoading,
      isError: gamesInfoDataError,
      error: gamesInfoDataErrorDetails,
      refetch: refetchGamesInfoData,
   } = useGetGamesInfoDataQuery(gameId, { skip: shouldSkip });
   const {
      data: screenShots,
      isLoading: screenShotsLoading,
      isError: screenShotsError,
   } = useGetScreenShotsQuery(gameId, {
      skip: shouldSkip,
   });
   const {
      data: dlcData,
      isLoading: dlcDataLoading,
      isError: dlcDataError,
   } = useGetDlcDataQuery(gameId, {
      skip: shouldSkip,
   });
   const {
      data: sameSeries,
      isLoading: sameSeriesLoading,
      isError: sameSeriesError,
   } = useGetSameSeriesQuery(gameId, {
      skip: shouldSkip,
   });
   const seenScreenshotImages = new Set<string>();
   const uniqueScreenshots = (screenShots?.results ?? []).filter(({ image }) => {
      if (!image || seenScreenshotImages.has(image)) {
         return false;
      }

      seenScreenshotImages.add(image);
      return true;
   });
   const isPrimaryLoading = gamesInfoDataLoading && !gamesInfoData && !gamesInfoDataError;
   const hasScreenshots = uniqueScreenshots.length > 0;
   const showScreenshotsFallback = !screenShotsLoading && !screenShotsError && !hasScreenshots;
   const showEmptyState = !gamesInfoDataLoading && !gamesInfoData && !gamesInfoDataError;
   const isConfigurationError = isRawgProxyConfigurationError(gamesInfoDataErrorDetails);
   const isSecondaryLoading = screenShotsLoading || dlcDataLoading || sameSeriesLoading;
   const hasSecondaryError = screenShotsError || dlcDataError || sameSeriesError;

   return (
      <main className="cardInfo py-7 sm:py-10">
         {isPrimaryLoading && <GamesInfoCardSkelton />}
         {gamesInfoDataError && (
            <div
               role="alert"
                className="bounty-panel rounded-arcade px-5 py-6 text-center text-lg font-black text-arcade-red">
               <p>
                  {isConfigurationError
                     ? 'Configuration error: missing RAWG_API_KEY on the server. Add it to the server environment and restart the app.'
                     : 'Failed to load game details. Please try again later.'}
               </p>
               {!isConfigurationError ? (
                  <button
                     type="button"
                     className="bounty-button bounty-button--secondary mt-4 px-5 py-3 text-sm"
                     onClick={() => {
                        void refetchGamesInfoData();
                     }}>
                     Retry details
                  </button>
               ) : null}
            </div>
         )}
         {showEmptyState && (
             <p className="bounty-panel rounded-arcade px-5 py-6 text-center text-lg font-black text-arcade-ink">
                Game details not found.
             </p>
         )}
         {gamesInfoData && (
            <div className="content flex flex-col justify-center gap-6">
                <section className="imgWrapper bounty-panel rounded-arcade p-3 sm:p-4">
                  <img
                     src={gamesInfoData.background_image}
                     alt={gamesInfoData.name ? `${gamesInfoData.name} cover` : 'Game cover'}
                  />
                  <div className="gameInfoHero">
                      <p className="bounty-kicker">Feature cover</p>
                      <h1 className="arcade-title mt-3 max-w-4xl text-4xl leading-[0.86] text-white sm:text-6xl lg:text-7xl">
                         {gamesInfoData.name}
                      </h1>
                     <div className="mt-5 flex flex-wrap gap-2">
                        <span className="gameInfoBadge">Released {gamesInfoData.released || 'TBA'}</span>
                        <span className="gameInfoBadge gameInfoBadge--score">
                           Score {gamesInfoData.metacritic ?? 'N/A'}
                        </span>
                        <span className="gameInfoBadge">
                           Achievements {gamesInfoData.achievements_count}
                        </span>
                     </div>
                  </div>
               </section>
                <section className="gameInfoWrapper bounty-panel rounded-arcade p-4 sm:p-6">
                  {hasScreenshots ? (
                     <Swiper
                         className="genres__list screenshotRail flex gap-3 items-center pb-4"
                        data-aos="fade-up"
                        modules={[Autoplay]}
                        autoplay={false}
                        spaceBetween={50}
                        breakpoints={{
                           320: {
                              slidesPerView: 1,
                              spaceBetween: 20,
                           },
                           425: {
                              slidesPerView: 1,
                              spaceBetween: 20,
                           },
                           640: {
                              slidesPerView: 1,
                              spaceBetween: 20,
                           },
                           768: {
                              slidesPerView: 2,
                              spaceBetween: 30,
                           },
                           1024: {
                              slidesPerView: 3,
                              spaceBetween: 40,
                           },
                        }}
                        slidesPerView={3}>
                        {uniqueScreenshots.map((item, index) => (
                           <SwiperSlide key={item.image}>
                              <img
                                 className="rounded-2xl screenshots__img"
                                 src={item.image}
                                 alt={
                                    gamesInfoData.name
                                       ? `${gamesInfoData.name} screenshot ${index + 1}`
                                       : `Game screenshot ${index + 1}`
                                 }
                                 loading="lazy"
                              />
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  ) : showScreenshotsFallback ? (
                      <p className="mb-4 rounded-arcade border-[3px] border-arcade-ink bg-arcade-paper px-4 py-3 text-base font-bold text-arcade-muted">
                         No screenshots available.
                      </p>
                  ) : screenShotsError ? (
                     <p
                        role="alert"
                         className="mb-4 rounded-arcade border-[3px] border-arcade-ink bg-arcade-red px-4 py-3 text-base font-black text-white">
                         Screenshots are unavailable right now.
                      </p>
                  ) : null}
                  <div className="textWrapper">
                      <p className="bounty-kicker">Platform rack</p>
                      <ul className="my-4 flex flex-wrap gap-2 text-sm text-arcade-ink">
                        {gamesInfoData.platforms.map((item) => (
                           <li
                              key={item.platform.id}
                              className={`rounded-full border px-3 py-1 font-bold ${
                                 item.platform.id === selectedPlatformId
                                    ? 'border-arcade-ink bg-arcade-red text-white shadow-[3px_3px_0_#15110f]'
                                    : 'border-arcade-ink bg-arcade-panel text-arcade-muted'
                              }`}>
                              {item.platform.name}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="infoWrapper">
                      <h2 className="arcade-title mt-6 text-3xl text-arcade-ink sm:text-4xl">
                         Feature Notes
                      </h2>
                      <p className="gameInfo__descr mt-3 text-base text-arcade-muted">
                         {gamesInfoData.description}
                      </p>
                      <div className="achivments my-5 flex flex-wrap items-center gap-3">
                         <p className="arcade-stat">
                            <span>Achievements</span>
                            <span>{gamesInfoData.achievements_count}</span>
                         </p>
                        <img
                            className="achivments__img"
                           src={achivments}
                           alt="Achievements"
                           loading="lazy"
                        />
                     </div>
                     {isSecondaryLoading ? (
                        <p
                           aria-live="polite"
                            className="my-4 rounded-arcade border-[3px] border-arcade-ink bg-arcade-paper px-4 py-3 text-base font-bold text-arcade-muted">
                            Loading related content...
                         </p>
                     ) : null}
                     {hasSecondaryError ? (
                        <p
                           role="alert"
                            className="my-4 rounded-arcade border-[3px] border-arcade-ink bg-arcade-red px-4 py-3 text-base font-black text-white">
                            Some related content could not be loaded. The main game details are still available.
                         </p>
                     ) : null}
                     <GameContentPlan
                        dlcItems={dlcData?.results ?? []}
                        platforms={gamesInfoData.platforms}
                        sameSeriesItems={sameSeries?.results ?? []}
                        selectedPlatformId={selectedPlatformId}
                     />
                  </div>
               </section>
            </div>
         )}
      </main>
   );
};

export default GameDetails;
