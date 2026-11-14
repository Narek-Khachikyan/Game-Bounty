import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSafeNextPath } from '../lib/authRedirect';

type AuthMode = 'sign-in' | 'create-account';

const getProviderLabel = (providerId: string) => {
   switch (providerId) {
      case 'password':
         return 'Email and password';
      case 'google.com':
         return 'Google';
      default:
         return providerId;
   }
};

const Auth = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const {
      currentUser,
      isAuthReady,
      isWorking,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOutCurrentUser,
   } = useAuth();
   const [mode, setMode] = useState<AuthMode>('sign-in');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [authError, setAuthError] = useState<string | null>(null);
   const nextPath = getSafeNextPath(searchParams.get('next'));
   const authErrorId = 'auth-form-error';

   const isCreateAccountMode = mode === 'create-account';

   const resetFormMessages = () => {
      setAuthError(null);
   };

   const handleModeChange = (nextMode: AuthMode) => {
      setMode(nextMode);
      resetFormMessages();
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFormMessages();

      const normalizedEmail = email.trim();

      if (!normalizedEmail) {
         setAuthError('Enter your email address.');
         return;
      }

      if (!password.trim()) {
         setAuthError('Enter your password.');
         return;
      }

      if (isCreateAccountMode && password !== confirmPassword) {
         setAuthError('Passwords do not match.');
         return;
      }

      try {
         if (isCreateAccountMode) {
            await signUpWithEmail(normalizedEmail, password);
         } else {
            await signInWithEmail(normalizedEmail, password);
         }

         navigate(nextPath, { replace: true });
      } catch (error) {
         setAuthError(error instanceof Error ? error.message : 'Unable to update your session.');
      }
   };

   const handleGoogleSignIn = async () => {
      resetFormMessages();

      try {
         await signInWithGoogle();
         navigate(nextPath, { replace: true });
      } catch (error) {
         setAuthError(error instanceof Error ? error.message : 'Unable to continue with Google.');
      }
   };

   const handleSignOut = async () => {
      resetFormMessages();

      try {
         await signOutCurrentUser();
      } catch (error) {
         setAuthError(error instanceof Error ? error.message : 'Unable to sign out right now.');
      }
   };

   if (!isAuthReady) {
      return (
         <section
            className="py-8 sm:py-16 min-h-[70vh] flex items-center justify-center"
            aria-busy="true"
            aria-live="polite">
            <div className="bounty-panel w-full max-w-xl rounded-arcade px-5 py-7 text-center sm:px-8 sm:py-10">
               <p className="bounty-kicker">Your collection</p>
               <h1 className="arcade-title mt-4 text-3xl text-arcade-ink">Checking your pass...</h1>
               <p className="bounty-copy mt-3">
                  Restoring your session…
               </p>
            </div>
         </section>
      );
   }

   if (currentUser) {
      const providerLabels = currentUser.providerData
         .map((provider) => provider.providerId)
         .filter(Boolean)
         .map((providerId) => getProviderLabel(providerId));

      return (
         <section className="py-8 sm:py-16 min-h-[70vh] flex items-center justify-center">
            <div className="bounty-panel w-full max-w-2xl rounded-arcade px-5 py-7 sm:px-8 sm:py-10">
               <p className="bounty-kicker">Pass active</p>
               <h1 className="arcade-title mt-4 text-3xl leading-[0.9] text-arcade-ink sm:text-5xl">
                  Your player shelf is synced.
               </h1>
               <div className="mt-8 rounded-arcade border border-arcade-line bg-arcade-paper p-6 text-arcade-muted shadow-arcade">
                  <p className="bounty-kicker">Account</p>
                  <p className="mt-3 text-2xl font-black text-arcade-ink">
                     {currentUser.displayName || currentUser.email || 'Firebase user'}
                  </p>
                  {currentUser.email ? (
                     <p className="mt-2 text-base font-semibold text-arcade-muted">{currentUser.email}</p>
                  ) : null}
                  {providerLabels.length > 0 ? (
                     <p className="mt-4 text-sm font-semibold text-arcade-muted">
                        Connected via {providerLabels.join(', ')}.
                     </p>
                  ) : null}
               </div>
               {authError ? (
                  <p
                     role="alert"
                     className="mt-6 rounded-arcade border border-arcade-line bg-arcade-red px-4 py-3 text-sm font-black text-white">
                     {authError}
                  </p>
               ) : null}
               <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={nextPath} className="bounty-button px-5 py-3 text-sm">
                     Continue
                  </Link>
                  <button
                     type="button"
                     onClick={handleSignOut}
                     disabled={isWorking}
                     className="bounty-button bounty-button--secondary px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-70">
                     {isWorking ? 'Signing out...' : 'Sign Out'}
                  </button>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="py-6 sm:py-12 min-h-[70vh] flex items-center">
         <div className="grid w-full gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:gap-8">
            <div className="bounty-panel rounded-arcade p-5 sm:p-8">
               <p className="bounty-kicker">Your collection</p>
               <h1 className="arcade-title mt-4 max-w-xl text-4xl leading-[0.88] text-arcade-ink sm:text-6xl">
                  Your next adventure, saved.
               </h1>
               <p className="bounty-copy mt-4 max-w-xl text-sm sm:mt-6 sm:text-base">
                  Sign in to save games and keep your collection with you across devices.
               </p>
               <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-arcade border border-arcade-line bg-arcade-yellow p-4 sm:p-5">
                     <p className="text-xs font-black uppercase tracking-[0.18em] text-arcade-ink">Email / Password</p>
                     <p className="mt-2 text-sm font-bold text-arcade-muted sm:mt-3 sm:text-base">
                        Create an account or sign back in with the same credentials.
                     </p>
                  </div>
                  <div className="rounded-arcade border border-arcade-line bg-arcade-panel p-4 sm:p-5">
                     <p className="text-xs font-black uppercase tracking-[0.18em] text-arcade-blue">Google</p>
                     <p className="mt-2 text-sm font-bold text-arcade-muted sm:mt-3 sm:text-base">
                        Continue with your Google account.
                     </p>
                  </div>
               </div>
            </div>

            <div className="rounded-arcade border border-arcade-line bg-arcade-panel p-5 text-arcade-ink shadow-arcade sm:p-8">
               <div className="flex rounded-full border border-arcade-line bg-arcade-paper p-1">
                  <button
                     type="button"
                     aria-pressed={mode === 'sign-in'}
                     className={`w-1/2 rounded-full px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:text-sm sm:tracking-[0.2em] ${
                        mode === 'sign-in'
                           ? 'bg-arcade-ink text-arcade-paper'
                           : 'text-arcade-muted hover:text-arcade-ink'
                     }`}
                     onClick={() => handleModeChange('sign-in')}>
                     Sign In
                  </button>
                  <button
                     type="button"
                     aria-pressed={mode === 'create-account'}
                     className={`w-1/2 rounded-full px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:text-sm sm:tracking-[0.2em] ${
                        mode === 'create-account'
                           ? 'bg-arcade-ink text-arcade-paper'
                           : 'text-arcade-muted hover:text-arcade-ink'
                     }`}
                     onClick={() => handleModeChange('create-account')}>
                     Create Account
                  </button>
               </div>

               <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-2 text-sm font-black text-arcade-ink">
                     Email
                     <input
                        type="email"
                        name="email"
                        aria-describedby={authError ? authErrorId : undefined}
                        aria-invalid={authError ? true : undefined}
                        autoComplete="email"
                        className="rounded-arcade border border-arcade-line bg-arcade-paper px-4 py-3 text-base font-bold text-arcade-ink transition-colors focus:bg-arcade-yellow"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-black text-arcade-ink">
                     Password
                     <input
                        type="password"
                        name="password"
                        aria-describedby={authError ? authErrorId : undefined}
                        aria-invalid={authError ? true : undefined}
                        autoComplete={isCreateAccountMode ? 'new-password' : 'current-password'}
                        className="rounded-arcade border border-arcade-line bg-arcade-paper px-4 py-3 text-base font-bold text-arcade-ink transition-colors focus:bg-arcade-yellow"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                     />
                  </label>

                  {isCreateAccountMode ? (
                     <label className="flex flex-col gap-2 text-sm font-black text-arcade-ink">
                        Confirm password
                        <input
                           type="password"
                           name="confirm-password"
                           aria-describedby={authError ? authErrorId : undefined}
                           aria-invalid={authError ? true : undefined}
                           autoComplete="new-password"
                           className="rounded-arcade border border-arcade-line bg-arcade-paper px-4 py-3 text-base font-bold text-arcade-ink transition-colors focus:bg-arcade-yellow"
                           placeholder="Repeat your password"
                           value={confirmPassword}
                           onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                     </label>
                  ) : null}

                  {authError ? (
                     <p
                        id={authErrorId}
                        role="alert"
                        className="rounded-arcade border border-arcade-line bg-arcade-red px-4 py-3 text-sm font-black text-white">
                        {authError}
                     </p>
                  ) : null}

                  <button
                     type="submit"
                     disabled={isWorking}
                     className="bounty-button mt-2 px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-70 sm:tracking-[0.2em]">
                     {isWorking
                        ? isCreateAccountMode
                           ? 'Creating account...'
                           : 'Signing in...'
                        : isCreateAccountMode
                           ? 'Create Account'
                           : 'Sign In'}
                  </button>
               </form>

               <div className="my-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-arcade-muted">
                  <span className="h-[3px] flex-1 bg-arcade-ink" />
                  <span>or</span>
                  <span className="h-[3px] flex-1 bg-arcade-ink" />
               </div>

               <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isWorking}
                  className="w-full rounded-full border border-arcade-line bg-arcade-yellow px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-arcade-ink shadow-[4px_4px_0_#15110f] transition-colors hover:bg-arcade-blue hover:text-arcade-paper disabled:cursor-wait disabled:opacity-70 sm:tracking-[0.2em]">
                  {isWorking ? 'Opening Google...' : 'Continue with Google'}
               </button>

               <p className="mt-6 text-sm font-semibold text-arcade-muted">
                  Need a different view first?{' '}
                  <Link to={nextPath} className="font-black text-arcade-blue underline underline-offset-4">
                     Return to the game catalog
                  </Link>
                  .
               </p>
            </div>
         </div>
      </section>
   );
};

export default Auth;
