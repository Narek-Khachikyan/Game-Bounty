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
   const isLoading =
      gamesInfoDataLoading || screenShotsLoading || dlcDataLoading || sameSeriesLoading;
   const hasScreenshots = (screenShots?.results ?? []).length > 0;
   const showScreenshotsFallback = !screenShotsLoading && !hasScreenshots;
   const showEmptyState = !isLoading && !gamesInfoData && !gamesInfoDataError;
   const isConfigurationError = isRawgProxyConfigurationError(gamesInfoDataErrorDetails);

   return (
      <div className="cardInfo py-7">
         {isLoading && !gamesInfoData && !gamesInfoDataError && <GamesInfoCardSkelton />}
         {gamesInfoDataError && (
            <p className="text-white text-center text-lg">
               {isConfigurationError
                  ? 'Configuration error: missing RAWG_API_KEY on the server. Add it to the server environment and restart the app.'
                  : 'Failed to load game details. Please try again later.'}
            </p>
         )}
         {showEmptyState && (
            <p className="text-white text-center text-lg">Game details not found.</p>
         )}
         {gamesInfoData && (
            <div className="content flex flex-col justify-center">
               <div className="imgWrapper">
                  <img
                     src={gamesInfoData.background_image}
                     alt={gamesInfoData.name ? `${gamesInfoData.name} cover` : 'Game cover'}
                  />
                  <p className="released bg-white text-violet-800 py-1 px-3">
                     {gamesInfoData.released}
                  </p>
                  <p className="raiting text-xl bg-white text-violet-800 py-1 px-3">
                     {gamesInfoData.metacritic ?? 'N/A'}
                  </p>
               </div>
               <div className="gameInfoWrapper bg-white p-4">
                  {hasScreenshots ? (
                     <Swiper
                        className="genres__list flex gap-3 items-center pb-4"
                        data-aos="fade-up"
                        modules={[Autoplay]}
                        autoplay={{ delay: 3000 }}
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
                        {screenShots?.results.map((item, index) => (
                           <SwiperSlide key={`${item.image}-${index}`}>
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
                     <p className="text-violet-950 text-base mb-4">No screenshots available.</p>
                  ) : null}
                  <div className="textWrapper">
                     <p className="gameInfo__name text-xl sm:text-xl md:text-2xl mb-1 text-violet-950">
                        {gamesInfoData.name}
                     </p>
                     <ul className="my-3 flex flex-wrap gap-2 text-sm text-violet-950">
                        {gamesInfoData.platforms.map((item) => (
                           <li
                              key={item.platform.id}
                              className={`rounded-full border px-3 py-1 ${
                                 item.platform.id === selectedPlatformId
                                    ? 'border-violet-900 bg-violet-900 text-white'
                                    : 'border-violet-200 bg-violet-50'
                              }`}>
                              {item.platform.name}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="infoWrapper">
                     <p className="gameInfo__descr text-base text-violet-950">
                        {gamesInfoData.description}
                     </p>
                     <div className="achivments flex items-center gap-1 my-2">
                        <p className="text-base sm:text-xl text-violet-950">Achievements Count:</p>
                        <p className="text-base bg-violet-950 text-white py-1 px-3">
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
               </div>
            </div>
         )}
      </div>
   );
};

export default GameCardInfo;
