import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import { useAppSelector } from '../../app/hooks';
import { selectFavoritesCount } from '../../app/redux/selectors/favorites';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
   isAnimatedBackgroundEnabled: boolean;
   animatedBackgroundBlockedReason: string | null;
   onAnimatedBackgroundToggle: (enabled: boolean) => void;
}

const Header = ({
   isAnimatedBackgroundEnabled,
   animatedBackgroundBlockedReason,
   onAnimatedBackgroundToggle,
}: HeaderProps) => {
   const location = useLocation();
   const count = useAppSelector(selectFavoritesCount);
   const { currentUser, isAuthReady, isWorking, signOutCurrentUser } = useAuth();
   const animatedBackgroundStatusId = animatedBackgroundBlockedReason
      ? 'animated-background-status'
      : undefined;
   const authLabel = currentUser?.displayName || currentUser?.email || 'Signed in';
   const favoritesLinkClassName =
      location.pathname === '/favorites'
         ? 'header__nav-link header__nav-link--active sm:text-sm md:text-base'
         : 'header__nav-link sm:text-sm md:text-base';
   const signInLinkClassName =
      location.pathname === '/auth'
         ? 'header__nav-link header__nav-link--active sm:text-sm md:text-base'
         : 'header__nav-link sm:text-sm md:text-base';

   const handleSignOut = async () => {
      try {
         await signOutCurrentUser();
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <header className="header">
         <div className="header__container">
            <div className="header__content py-4">
               <div className="header__brand">
                  <Link to={'/'} className="header__logo" aria-label="Game-Bounty home">
                     <span className="header__logo-mark" aria-hidden="true">GB</span>
                     <span className="header__logo-text sm:text-xl md:text-2xl">Game-Bounty</span>
                     <span className="header__issue" aria-hidden="true">Arcade Catalog</span>
                  </Link>
               </div>
               <nav className="header__nav" aria-label="Primary navigation">
                  <ul className="header__nav-list">
                     <li className="header__nav-item relative">
                        <Link to={'/favorites'} className={favoritesLinkClassName}>
                           <span>Saved Shelf</span>
                           <span className="count absolute text-sm" aria-label={`${count} saved bounties`}>
                              {count}
                           </span>
                        </Link>
                     </li>
                  </ul>
               </nav>
               <div className="header__actions">
                  {isAuthReady ? (
                     currentUser ? (
                        <div className="header__account">
                           <span className="header__session">
                              <span className="header__session-label">Player pass</span>
                              <span className="header__session-text" title={authLabel}>
                                 {authLabel}
                              </span>
                           </span>
                           <button
                              type="button"
                              className="header__signout sm:text-sm md:text-base"
                              onClick={handleSignOut}
                              disabled={isWorking}>
                              {isWorking ? 'Signing out...' : 'Sign Out'}
                           </button>
                        </div>
                     ) : (
                        <Link to={'/auth'} className={signInLinkClassName}>
                           Player Pass
                        </Link>
                     )
                  ) : (
                     <span className="header__session header__session--pending">
                           Checking pass...
                     </span>
                  )}
                  <label className="video-toggle">
                     <input
                        type="checkbox"
                        checked={isAnimatedBackgroundEnabled}
                        onChange={(event) => onAnimatedBackgroundToggle(event.target.checked)}
                        aria-label="Animated background"
                        aria-describedby={animatedBackgroundStatusId}
                     />
                     <span className="video-toggle__content">
                        <span className="sm:text-sm md:text-base font-medium">
                           Motion cover
                        </span>
                        {animatedBackgroundBlockedReason ? (
                           <span
                              id={animatedBackgroundStatusId}
                              className="video-toggle__status text-xs text-arcade-muted">
                              {animatedBackgroundBlockedReason}
                           </span>
                        ) : null}
                     </span>
                  </label>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
