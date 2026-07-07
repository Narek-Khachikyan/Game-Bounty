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
            <div className="bounty-panel w-full max-w-xl rounded-dossier px-5 py-7 text-center sm:px-8 sm:py-10">
               <p className="bounty-kicker">Access checkpoint</p>
               <h1 className="mt-3 text-2xl font-black text-bounty-ink">Checking your session...</h1>
               <p className="bounty-copy mt-3">
                  Firebase is restoring any saved login before we show the form.
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
            <div className="bounty-panel w-full max-w-2xl rounded-dossier px-5 py-7 sm:px-8 sm:py-10">
               <p className="bounty-kicker">Session ready</p>
               <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] text-bounty-ink sm:text-4xl">
                  You are signed in to Game-Bounty
               </h1>
               <div className="mt-8 rounded-3xl border border-bounty-line bg-white/5 p-6 text-bounty-muted">
                  <p className="bounty-kicker">Account</p>
                  <p className="mt-3 text-2xl font-black text-bounty-ink">
                     {currentUser.displayName || currentUser.email || 'Firebase user'}
                  </p>
                  {currentUser.email ? (
                     <p className="mt-2 text-base text-bounty-muted">{currentUser.email}</p>
                  ) : null}
                  {providerLabels.length > 0 ? (
                     <p className="mt-4 text-sm text-bounty-muted">
                        Connected via {providerLabels.join(', ')}.
                     </p>
                  ) : null}
               </div>
               {authError ? (
                  <p
                     role="alert"
                     className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
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
            <div className="bounty-panel rounded-dossier p-5 sm:p-8">
               <p className="bounty-kicker">Firebase Auth</p>
               <h1 className="mt-3 max-w-lg text-2xl font-black leading-tight tracking-[-0.04em] text-bounty-ink sm:mt-4 sm:text-4xl">
                  Sync your bounty board across devices.
               </h1>
               <p className="bounty-copy mt-4 max-w-xl text-sm sm:mt-6 sm:text-base">
                  Favorites now belong to your Firebase account instead of this browser, so
                  signing in keeps the same saved games available across devices.
               </p>
               <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-3xl border border-bounty-line bg-white/5 p-4 sm:p-5">
                     <p className="bounty-kicker">Email / Password</p>
                     <p className="mt-2 text-sm text-bounty-muted sm:mt-3 sm:text-base">
                        Create an account or sign back in with the same credentials.
                     </p>
                  </div>
                  <div className="rounded-3xl border border-bounty-line bg-white/5 p-4 sm:p-5">
                     <p className="bounty-kicker">Google</p>
                     <p className="mt-2 text-sm text-bounty-muted sm:mt-3 sm:text-base">
                        Use the Google popup flow for a faster one-click sign-in.
                     </p>
                  </div>
               </div>
            </div>

            <div className="rounded-dossier border border-bounty-line bg-contract-paper p-5 text-contract-ink shadow-contract sm:p-8">
               <div className="flex rounded-full bg-contract-ink/10 p-1">
                  <button
                     type="button"
                     aria-pressed={mode === 'sign-in'}
                     className={`w-1/2 rounded-full px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:text-sm sm:tracking-[0.2em] ${
                        mode === 'sign-in'
                           ? 'bg-contract-ink text-contract-paper'
                           : 'text-contract-muted hover:text-contract-ink'
                     }`}
                     onClick={() => handleModeChange('sign-in')}>
                     Sign In
                  </button>
                  <button
                     type="button"
                     aria-pressed={mode === 'create-account'}
                     className={`w-1/2 rounded-full px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:text-sm sm:tracking-[0.2em] ${
                        mode === 'create-account'
                           ? 'bg-contract-ink text-contract-paper'
                           : 'text-contract-muted hover:text-contract-ink'
                     }`}
                     onClick={() => handleModeChange('create-account')}>
                     Create Account
                  </button>
               </div>

               <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-2 text-sm font-bold text-contract-ink">
                     Email
                     <input
                        type="email"
                        name="email"
                        aria-describedby={authError ? authErrorId : undefined}
                        aria-invalid={authError ? true : undefined}
                        autoComplete="email"
                        className="rounded-2xl border border-contract-muted/30 bg-white/70 px-4 py-3 text-base text-contract-ink outline-none transition-colors focus:border-contract-stamp"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-bold text-contract-ink">
                     Password
                     <input
                        type="password"
                        name="password"
                        aria-describedby={authError ? authErrorId : undefined}
                        aria-invalid={authError ? true : undefined}
                        autoComplete={isCreateAccountMode ? 'new-password' : 'current-password'}
                        className="rounded-2xl border border-contract-muted/30 bg-white/70 px-4 py-3 text-base text-contract-ink outline-none transition-colors focus:border-contract-stamp"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                     />
                  </label>

                  {isCreateAccountMode ? (
                     <label className="flex flex-col gap-2 text-sm font-bold text-contract-ink">
                        Confirm password
                        <input
                           type="password"
                           name="confirm-password"
                           aria-describedby={authError ? authErrorId : undefined}
                           aria-invalid={authError ? true : undefined}
                           autoComplete="new-password"
                           className="rounded-2xl border border-contract-muted/30 bg-white/70 px-4 py-3 text-base text-contract-ink outline-none transition-colors focus:border-contract-stamp"
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
                        className="rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                        {authError}
                     </p>
                  ) : null}

                  <button
                     type="submit"
                     disabled={isWorking}
                     className="mt-2 rounded-full bg-contract-ink px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-contract-paper transition-colors hover:bg-contract-stamp disabled:cursor-wait disabled:opacity-70 sm:tracking-[0.2em]">
                     {isWorking
                        ? isCreateAccountMode
                           ? 'Creating account...'
                           : 'Signing in...'
                        : isCreateAccountMode
                           ? 'Create Account'
                           : 'Sign In'}
                  </button>
               </form>

               <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-contract-muted">
                  <span className="h-px flex-1 bg-contract-muted/25" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-contract-muted/25" />
               </div>

               <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isWorking}
                  className="w-full rounded-full border border-contract-muted/30 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-contract-ink transition-colors hover:border-contract-stamp hover:text-contract-stamp disabled:cursor-wait disabled:opacity-70 sm:tracking-[0.2em]">
                  {isWorking ? 'Opening Google...' : 'Continue with Google'}
               </button>

               <p className="mt-6 text-sm text-contract-muted">
                  Need a different view first?{' '}
                  <Link to="/" className="font-black text-contract-stamp underline underline-offset-4">
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
