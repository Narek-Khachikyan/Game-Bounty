import { useParams } from 'react-router-dom';
import { useGetGamesInfoDataQuery } from '../../app/redux/features/apiSlice';
import './gamesInfoCard.scss';
import achivments from '../../assets/achivments.png';
import { GamesInfoCardSkelton } from '../Skeleton/Skeleton';

const GameCardInfo = () => {
   const { id } = useParams();
   const { data: gamesInfoData, isLoading: gamesInfoDataLoading } = useGetGamesInfoDataQuery(
      id ?? '',
   );

   return (
      <div className="cardInfo py-7">
         <div className="content flex flex-col justify-center">
            <div className="imgWrapper">
               <img src={gamesInfoData?.background_image} alt="" />
               <p className="released bg-white text-violet-800 py-1 px-3">
                  {gamesInfoData?.released}
               </p>
               <p className="raiting text-xl bg-white text-violet-800 py-1 px-3">
                  {gamesInfoData?.metacritic}
               </p>
            </div>
            <div className="gameInfoWrapper bg-white p-4">
               <div className="textWrapper">
                  <p className="gameInfo__name text-xl sm:text-xl md:text-2xl mb-1 text-violet-950">
                     {gamesInfoData?.name}
                  </p>
                  <ul className="mb-2 grid grid-cols-2 grid-rows-1 gap-2 text-base md:text-xl text-violet-950 sm:flex sm:items-center">
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
                     <img className="achivments__img" src={achivments} alt="" />
                  </div>
               </div>
            </div>
         </div>
         {gamesInfoDataLoading && <GamesInfoCardSkelton />}
      </div>
   );
};

export default GameCardInfo;
