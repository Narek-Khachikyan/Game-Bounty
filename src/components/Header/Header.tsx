import { Link, useLocation } from 'react-router-dom';
import './header.scss';

const Header = () => {
   const location = useLocation();

   return (
      <div className="header bg-white">
         <div className="header__container">
            <div className="header__content py-4 flex items-center justify-between">
               <Link to={'/'}>
                  <p className="header__logo text-2xl text">Game-Bounty</p>
               </Link>
               <nav className="header__nav">
                  <ul className="header__nav-list flex gap-5">
                     <li className="header__nav-item">
                        <Link
                           to={'/platforms'}
                           className={
                              location.pathname === '/platforms'
                                 ? 'active'
                                 : 'header__nav-link text-base'
                           }>
                           Platforms
                        </Link>
                     </li>
                     <li className="header__nav-item">
                        <Link
                           to={'/favorites'}
                           className={
                              location.pathname === '/favorites'
                                 ? 'active'
                                 : 'header__nav-link text-base'
                           }>
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
