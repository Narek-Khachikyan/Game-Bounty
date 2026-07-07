import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { buildAuthRedirectPath } from '../../lib/authRedirect';

const RequireAuth = ({ children }: PropsWithChildren) => {
   const location = useLocation();
   const { currentUser, isAuthReady } = useAuth();

   if (!isAuthReady) {
      return (
         <section className="py-16 min-h-[70vh] flex items-center justify-center">
            <div className="bounty-panel w-full max-w-xl rounded-dossier px-8 py-10 text-center">
               <p className="bounty-kicker">Access checkpoint</p>
               <h1 className="mt-3 text-2xl font-black text-bounty-ink">Checking your session...</h1>
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
