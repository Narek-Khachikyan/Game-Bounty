import { Link } from 'react-router-dom';
import './header.scss';

const Header = () => {
   return (
      <div className="header bg-white">
         <div className="header__container">
            <div className="header__content py-4 flex items-center justify-between">
               <p className="header__logo text-2xl text">Game-Bounty</p>
               <nav className="header__nav">
                  <ul className="header__nav-list flex gap-5">
                     <li className="header__nav-item">
                        <Link to={'/genres'} className="header__nav-link text-base">
                           Genres
                        </Link>
                     </li>
                     <li className="header__nav-item">
                        <Link to={'/platforms'} className="header__nav-link text-base">
                           Platforms
                        </Link>
                     </li>
                     <li className="header__nav-item">
                        <Link to={'/favorites'} className="header__nav-link text-base">
                           Favorites
                        </Link>
                     </li>
                  </ul>
               </nav>
            </div>
         </div>
      </div>
   );
};

export default Header;
