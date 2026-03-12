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
   const { currentUser, isAuthReady, isWorking, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutCurrentUser } =
      useAuth();
   const [mode, setMode] = useState<AuthMode>('sign-in');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [authError, setAuthError] = useState<string | null>(null);
   const nextPath = getSafeNextPath(searchParams.get('next'));

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
         <section className="py-16 min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl bg-white px-8 py-10 text-center shadow-2xl shadow-slate-950/30">
               <p className="text-violet-950 text-2xl font-semibold">Checking your session...</p>
               <p className="mt-3 text-slate-600">
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
         <section className="py-16 min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-[32px] bg-white px-8 py-10 shadow-2xl shadow-slate-950/30">
               <p className="text-sm uppercase tracking-[0.35em] text-violet-700">Session ready</p>
               <h1 className="mt-4 text-4xl font-semibold text-violet-950">
                  You are signed in to Game-Bounty
               </h1>
               <div className="mt-8 rounded-3xl bg-slate-100 p-6 text-slate-700">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Account</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                     {currentUser.displayName || currentUser.email || 'Firebase user'}
                  </p>
                  {currentUser.email ? (
                     <p className="mt-2 text-base text-slate-600">{currentUser.email}</p>
                  ) : null}
                  {providerLabels.length > 0 ? (
                     <p className="mt-4 text-sm text-slate-500">
                        Connected via {providerLabels.join(', ')}.
                     </p>
                  ) : null}
               </div>
               {authError ? (
                  <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                     {authError}
                  </p>
               ) : null}
               <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                     to={nextPath}
                     className="rounded-full bg-violet-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-violet-800">
                     Continue
                  </Link>
                  <button
                     type="button"
                     onClick={handleSignOut}
                     disabled={isWorking}
                     className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-violet-700 hover:text-violet-900 disabled:cursor-wait disabled:opacity-70">
                     {isWorking ? 'Signing out...' : 'Sign Out'}
                  </button>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="py-12 min-h-[70vh] flex items-center">
         <div className="grid w-full gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 text-white shadow-2xl shadow-slate-950/40 backdrop-blur">
               <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Firebase Auth</p>
               <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight">
                  Sign in with email or Google and keep your favorites tied to your account.
               </h1>
               <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
                  Favorites now belong to your Firebase account instead of this browser, so
                  signing in keeps the same saved games available across devices.
               </p>
               <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                     <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                        Email / Password
                     </p>
                     <p className="mt-3 text-slate-200">
                        Create an account or sign back in with the same credentials.
                     </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                     <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Google</p>
                     <p className="mt-3 text-slate-200">
                        Use the Google popup flow for a faster one-click sign-in.
                     </p>
                  </div>
               </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-950/30">
               <div className="flex rounded-full bg-slate-100 p-1">
                  <button
                     type="button"
                     className={`w-1/2 rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                        mode === 'sign-in'
                           ? 'bg-violet-900 text-white'
                           : 'text-slate-600 hover:text-violet-900'
                     }`}
                     onClick={() => handleModeChange('sign-in')}>
                     Sign In
                  </button>
                  <button
                     type="button"
                     className={`w-1/2 rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                        mode === 'create-account'
                           ? 'bg-violet-900 text-white'
                           : 'text-slate-600 hover:text-violet-900'
                     }`}
                     onClick={() => handleModeChange('create-account')}>
                     Create Account
                  </button>
               </div>

               <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                     Email
                     <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-700"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                     Password
                     <input
                        type="password"
                        name="password"
                        autoComplete={isCreateAccountMode ? 'new-password' : 'current-password'}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-700"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                     />
                  </label>

                  {isCreateAccountMode ? (
                     <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                        Confirm password
                        <input
                           type="password"
                           name="confirm-password"
                           autoComplete="new-password"
                           className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-violet-700"
                           placeholder="Repeat your password"
                           value={confirmPassword}
                           onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                     </label>
                  ) : null}

                  {authError ? (
                     <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {authError}
                     </p>
                  ) : null}

                  <button
                     type="submit"
                     disabled={isWorking}
                     className="mt-2 rounded-full bg-violet-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-violet-800 disabled:cursor-wait disabled:opacity-70">
                     {isWorking
                        ? isCreateAccountMode
                           ? 'Creating account...'
                           : 'Signing in...'
                        : isCreateAccountMode
                           ? 'Create Account'
                           : 'Sign In'}
                  </button>
               </form>

               <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-slate-200" />
               </div>

               <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isWorking}
                  className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-violet-700 hover:text-violet-900 disabled:cursor-wait disabled:opacity-70">
                  {isWorking ? 'Opening Google...' : 'Continue with Google'}
               </button>

               <p className="mt-6 text-sm text-slate-500">
                  Need a different view first?{' '}
                  <Link to="/" className="font-semibold text-violet-900 underline underline-offset-4">
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
