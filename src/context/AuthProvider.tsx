import { useEffect, useState, type PropsWithChildren } from 'react';
import {
   createUserWithEmailAndPassword,
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
   type User,
} from 'firebase/auth';
import { firebaseAuth, googleAuthProvider } from '../lib/firebase';
import { AuthContext } from './authContext';

const hasFirebaseErrorCode = (
   error: unknown,
): error is {
   code: string;
} => typeof error === 'object' && error !== null && 'code' in error;

const getFirebaseAuthErrorMessage = (error: unknown): string => {
   if (!hasFirebaseErrorCode(error)) {
      return 'Something went wrong while updating your session. Please try again.';
   }

   switch (error.code) {
      case 'auth/email-already-in-use':
         return 'This email is already in use. Try signing in instead.';
      case 'auth/invalid-email':
         return 'Enter a valid email address.';
      case 'auth/invalid-credential':
         return 'The email or password is incorrect.';
      case 'auth/missing-password':
         return 'Enter your password to continue.';
      case 'auth/operation-not-allowed':
         return 'This sign-in method is not enabled in Firebase Authentication yet.';
      case 'auth/popup-blocked':
         return 'Your browser blocked the Google sign-in popup. Allow popups and try again.';
      case 'auth/popup-closed-by-user':
         return 'Google sign-in was closed before it finished.';
      case 'auth/cancelled-popup-request':
         return 'Another sign-in popup is already open.';
      case 'auth/unauthorized-domain':
         return 'This app origin is not yet authorized in Firebase Authentication. Add the current domain to Firebase authorized domains and try again.';
      case 'auth/network-request-failed':
         return 'A network error interrupted sign-in. Check your connection and try again.';
      case 'auth/too-many-requests':
         return 'Too many attempts were made. Wait a moment and try again.';
      case 'auth/weak-password':
         return 'Use a stronger password with at least 6 characters.';
      case 'auth/account-exists-with-different-credential':
         return 'This email already belongs to another sign-in method.';
      default:
         return 'Something went wrong while updating your session. Please try again.';
   }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [isAuthReady, setIsAuthReady] = useState(false);
   const [isWorking, setIsWorking] = useState(false);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
         setCurrentUser(nextUser);
         setIsAuthReady(true);
      });

      return unsubscribe;
   }, []);

   const executeAuthAction = async (action: () => Promise<void>) => {
      setIsWorking(true);

      try {
         await action();
      } catch (error) {
         throw new Error(getFirebaseAuthErrorMessage(error));
      } finally {
         setIsWorking(false);
      }
   };

   const signInWithEmail = async (email: string, password: string) => {
      await executeAuthAction(async () => {
         await signInWithEmailAndPassword(firebaseAuth, email, password);
      });
   };

   const signUpWithEmail = async (email: string, password: string) => {
      await executeAuthAction(async () => {
         await createUserWithEmailAndPassword(firebaseAuth, email, password);
      });
   };

   const signInWithGoogle = async () => {
      await executeAuthAction(async () => {
         await signInWithPopup(firebaseAuth, googleAuthProvider);
      });
   };

   const signOutCurrentUser = async () => {
      await executeAuthAction(async () => {
         await signOut(firebaseAuth);
      });
   };

   return (
      <AuthContext.Provider
         value={{
            currentUser,
            isAuthReady,
            isWorking,
            signInWithEmail,
            signUpWithEmail,
            signInWithGoogle,
            signOutCurrentUser,
         }}>
         {children}
      </AuthContext.Provider>
   );
};
