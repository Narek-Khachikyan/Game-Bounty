import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { buildAuthRedirectPath } from '../../lib/authRedirect';

const RequireAuth = ({ children }: PropsWithChildren) => {
   const location = useLocation();
   const { currentUser, isAuthReady } = useAuth();

   if (!isAuthReady) {
      return (
         <section
            className="py-16 min-h-[70vh] flex items-center justify-center"
            aria-busy="true"
            aria-live="polite">
             <div className="bounty-panel w-full max-w-xl rounded-arcade px-8 py-10 text-center">
                <p className="bounty-kicker">Player pass</p>
                <h1 className="arcade-title mt-4 text-3xl text-arcade-ink">Checking your pass...</h1>
               <p className="bounty-copy mt-3">
                  Sign in is required before we can load your personal favorites.
               </p>
            </div>
         </section>
      );
   }

   if (!currentUser) {
      const nextPath = `${location.pathname}${location.search}${location.hash}`;
      return <Navigate to={buildAuthRedirectPath(nextPath)} replace />;
   }

   return <>{children}</>;
};

export default RequireAuth;
