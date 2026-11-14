import GameArtwork from "../GameArtwork/GameArtwork";
import { FC } from 'react';
import SaveGameAction from '../SaveGameAction/SaveGameAction';
import type { GameData } from '../../@types/types';
import '../../GlobalStyles/globalCardStyles.scss';
import { Link } from 'react-router-dom';

type GameCardProps = GameData & {
   selectedPlatformId?: number;
};

const GameCard: FC<GameCardProps> = ({
   id,
   name,
   released,
   background_image,
   metacritic,
   platforms,
   selectedPlatformId,
}) => {
   const game = { id, name, released, background_image, metacritic, platforms };
   const gameDetailsPath = selectedPlatformId
      ? `/game/${id}?platform=${selectedPlatformId}`
      : `/game/${id}`;

   return (
      <article className="card" id={`game-${id}`} tabIndex={-1}>
         <div className="card__container">
            <Link to={gameDetailsPath} className="card__link">
               <div className="card__content">
                  <div className="card__wrapper">
                     <div className="card__image"><GameArtwork src={background_image} name={name} /></div>
                     <div className="card__badges" aria-label="Game metadata">
                        <span className="raiting">Metacritic {metacritic ?? 'N/A'}</span>
                        <span className="released">{released ? new Date(`${released}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBA'}</span>
                     </div>
                     <div className="card__textWrapper">

                        <h3 className="card__name">{name}</h3>
                        <div className="platform-wrapper">
                           {platforms.map((item) => (
                              <span key={item.platform.id}>{item.platform.name}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </Link>
            <SaveGameAction game={game} />
         </div>
      </article>
   );
};

export default GameCard;
