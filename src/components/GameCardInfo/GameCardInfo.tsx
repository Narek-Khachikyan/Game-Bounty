import { useParams, useSearchParams } from 'react-router-dom';
import {
   isRawgProxyConfigurationError,
   useGetDlcDataQuery,
   useGetGamesInfoDataQuery,
   useGetSameSeriesQuery,
   useGetScreenShotsQuery,
} from '../../app/redux/features/apiSlice';
import './gamesInfoCard.scss';
import achivments from '../../assets/achivments.png';
import { GamesInfoCardSkelton } from '../Skeleton/Skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import GameContentPlan from '../GameContentPlan/GameContentPlan';

const GameCardInfo = () => {
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
   } = useGetGamesInfoDataQuery(gameId, { skip: shouldSkip });
   const { data: screenShots, isLoading: screenShotsLoading } = useGetScreenShotsQuery(gameId, {
      skip: shouldSkip,
   });
   const { data: dlcData, isLoading: dlcDataLoading } = useGetDlcDataQuery(gameId, {
      skip: shouldSkip,
   });
   const { data: sameSeries, isLoading: sameSeriesLoading } = useGetSameSeriesQuery(gameId, {
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
   const isLoading =
      gamesInfoDataLoading || screenShotsLoading || dlcDataLoading || sameSeriesLoading;
   const hasScreenshots = uniqueScreenshots.length > 0;
   const showScreenshotsFallback = !screenShotsLoading && !hasScreenshots;
   const showEmptyState = !isLoading && !gamesInfoData && !gamesInfoDataError;
   const isConfigurationError = isRawgProxyConfigurationError(gamesInfoDataErrorDetails);

   return (
      <main className="cardInfo py-7 sm:py-10">
         {isLoading && !gamesInfoData && !gamesInfoDataError && <GamesInfoCardSkelton />}
         {gamesInfoDataError && (
            <p className="bounty-panel rounded-3xl px-5 py-6 text-center text-lg text-red-100">
               {isConfigurationError
                  ? 'Configuration error: missing RAWG_API_KEY on the server. Add it to the server environment and restart the app.'
                  : 'Failed to load game details. Please try again later.'}
            </p>
         )}
         {showEmptyState && (
            <p className="bounty-panel rounded-3xl px-5 py-6 text-center text-lg text-bounty-ink">Game details not found.</p>
         )}
         {gamesInfoData && (
            <div className="content flex flex-col justify-center gap-6">
               <section className="imgWrapper bounty-panel rounded-dossier p-3 sm:p-4">
                  <img
                     src={gamesInfoData.background_image}
                     alt={gamesInfoData.name ? `${gamesInfoData.name} cover` : 'Game cover'}
                  />
                  <div className="gameInfoHero">
                     <p className="bounty-kicker">Game intelligence dossier</p>
                     <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-bounty-ink sm:text-6xl">
                        {gamesInfoData.name}
                     </h1>
                     <div className="mt-5 flex flex-wrap gap-2">
                        <span className="gameInfoBadge">Released {gamesInfoData.released || 'TBA'}</span>
                        <span className="gameInfoBadge gameInfoBadge--score">Score {gamesInfoData.metacritic ?? 'N/A'}</span>
                        <span className="gameInfoBadge">Achievements {gamesInfoData.achievements_count}</span>
                     </div>
                  </div>
               </section>
               <section className="gameInfoWrapper bounty-panel rounded-dossier p-4 sm:p-6">
                  {hasScreenshots ? (
                     <Swiper
                        className="genres__list flex gap-3 items-center pb-4"
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
                     <p className="mb-4 rounded-2xl border border-bounty-line bg-white/5 px-4 py-3 text-base text-bounty-muted">No screenshots available.</p>
                  ) : null}
                  <div className="textWrapper">
                     <p className="bounty-kicker">Platform coverage</p>
                     <ul className="my-3 flex flex-wrap gap-2 text-sm text-bounty-ink">
                        {gamesInfoData.platforms.map((item) => (
                           <li
                              key={item.platform.id}
                              className={`rounded-full border px-3 py-1 font-bold ${
                                 item.platform.id === selectedPlatformId
                                    ? 'border-bounty-amber bg-bounty-amber text-contract-ink'
                                    : 'border-bounty-line bg-white/5 text-bounty-muted'
                              }`}>
                              {item.platform.name}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="infoWrapper">
                     <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-bounty-ink">
                        Briefing notes
                     </h2>
                     <p className="gameInfo__descr mt-3 text-base text-bounty-muted">
                        {gamesInfoData.description}
                     </p>
                     <div className="achivments flex items-center gap-1 my-2">
                        <p className="text-base font-bold text-bounty-ink sm:text-xl">Achievement count</p>
                        <p className="rounded-full bg-bounty-amber px-3 py-1 text-base font-black text-contract-ink">
                           {gamesInfoData.achievements_count}
                        </p>
                        <img
                           className="achivments__img"
                           src={achivments}
                           alt="Achievements"
                           loading="lazy"
                        />
                     </div>
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

export default GameCardInfo;
