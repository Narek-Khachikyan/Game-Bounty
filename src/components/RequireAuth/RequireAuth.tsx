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
            <div className="w-full max-w-xl rounded-3xl bg-white px-8 py-10 text-center shadow-2xl shadow-slate-950/30">
               <p className="text-violet-950 text-2xl font-semibold">Checking your session...</p>
               <p className="mt-3 text-slate-600">
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
