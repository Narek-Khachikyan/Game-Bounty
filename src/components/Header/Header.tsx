import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import { useSelector } from 'react-redux';

const Header = () => {
   const location = useLocation();
   const count = useSelector((state: any) => state.favorites.count);
   return (
      <div className="header bg-white">
         <div className="header__container">
            <div className="header__content py-4 flex items-center justify-between">
               <Link to={'/'}>
                  <p className="header__logo sm:text-xl md:text-2xl text">Game-Bounty</p>
               </Link>
               <nav className="header__nav">
                  <ul className="header__nav-list flex gap-2 items-center">
                     <li className="header__nav-item">
                        <Link
                           to={'/platforms'}
                           className={
                              location.pathname === '/platforms'
                                 ? 'active'
                                 : 'header__nav-link sm:text-sm md:text-base'
                           }>
                           Platforms
                        </Link>
                     </li>
                     <li className="header__nav-item relative">
                        <Link
                           to={'/favorites'}
                           className={
                              location.pathname === '/favorites'
                                 ? 'active'
                                 : 'header__nav-link sm:text-sm md:text-base'
                           }>
                           Favorites
                           <p className="count absolute text-white bg-violet-950 text-sm">
                              {count}
                           </p>
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
