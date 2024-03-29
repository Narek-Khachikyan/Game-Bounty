import { Link, useParams } from 'react-router-dom';
import {
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
import DlcCard from '../DlcCard/DlcCard';
import SameSeriesCard from '../SameSeriesCard/SameSeriesCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const GameCardInfo = () => {
   const { id } = useParams();
   const { data: gamesInfoData, isLoading: gamesInfoDataLoading } = useGetGamesInfoDataQuery(
      id ?? '',
   );
   const { data: screenShots, isLoading: screenShotsLoading } = useGetScreenShotsQuery(
      gamesInfoData?.slug ?? '',
   );
   const { data: dlcData, isLoading: dlcDataLoading } = useGetDlcDataQuery(
      gamesInfoData?.slug ?? '',
   );
   const { data: sameSeries, isLoading: sameSeriesLoading } = useGetSameSeriesQuery(
      gamesInfoData?.slug ?? '',
   );

   useEffect(() => {
      AOS.init();
   }, []);

   return (
      <div className="cardInfo py-7">
         {gamesInfoDataLoading && screenShotsLoading && dlcDataLoading && sameSeriesLoading && (
            <GamesInfoCardSkelton />
         )}
         <div className="content flex flex-col justify-center">
            <div className="imgWrapper">
               <img src={gamesInfoData?.background_image} alt="gameInfoImg" />
               <p className="released bg-white text-violet-800 py-1 px-3">
                  {gamesInfoData?.released}
               </p>
               <p className="raiting text-xl bg-white text-violet-800 py-1 px-3">
                  {gamesInfoData?.metacritic}
               </p>
            </div>
            <div className="gameInfoWrapper bg-white p-4">
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
                     <SwiperSlide>
                        <img
                           className="rounded-2xl screenshots__img"
                           key={index}
                           src={item.image}
                           alt="screenshotsSliderImg"
                        />
                     </SwiperSlide>
                  ))}
               </Swiper>
               <div className="textWrapper">
                  <p className="gameInfo__name text-xl sm:text-xl md:text-2xl mb-1 text-violet-950">
                     {gamesInfoData?.name}
                  </p>
                  <ul className="my-2 text-violet-950 text-base grid grid-cols-2 grid-rows-1 items-center sm:flex sm:justify-between sm:flex-wrap">
                     {gamesInfoData?.platforms.map((item) => (
                        <li>{item.platform.name}</li>
                     ))}
                  </ul>
               </div>
               <div className="infoWrapper">
                  <p className="gameInfo__descr text-base text-violet-950">
                     {gamesInfoData?.description.replace(/(<([^>]+)>)/gi, '')}
                  </p>
                  <div className="achivments flex items-center gap-1 my-2">
                     <p className="text-base sm:text-xl text-violet-950">Achievements Count:</p>
                     <p className="text-base bg-violet-950 text-white py-1 px-3">
                        {gamesInfoData?.achievements_count}
                     </p>
                     <img className="achivments__img" src={achivments} alt="achivmentsImg" />
                  </div>
                  <div
                     className={
                        sameSeries && sameSeries.results && sameSeries.results.length > 0
                           ? 'sameSeries py-4'
                           : 'display-none'
                     }>
                     <p className="text-2xl text-violet-950 mb-4 ">
                        {sameSeries && sameSeries.results && sameSeries.results.length > 0
                           ? 'Games that are part of the same series'
                           : null}
                     </p>
                     <Swiper
                        className="genres__list flex gap-3 items-center"
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
                        {sameSeries?.results.map((item) => (
                           <SwiperSlide>
                              <Link onClick={() => window.scrollTo(0, 0)} to={`/game/${item.id}`}>
                                 <SameSeriesCard key={item.id} {...item} />
                              </Link>
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </div>
                  <div
                     className={
                        dlcData && dlcData.results && dlcData.results.length > 0
                           ? 'dlc py-4'
                           : 'display-none'
                     }>
                     <p className="text-2xl text-violet-950 mb-4 ">
                        {dlcData && dlcData.results && dlcData.results.length > 0
                           ? "All game's dlc"
                           : null}
                     </p>
                     <div className="dlcWrapper flex flex-wrap gap-4" data-aos="fade-up">
                        {dlcData?.results.map((item) => (
                           <DlcCard key={item.id} {...item} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default GameCardInfo;
