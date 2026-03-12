import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthContextValue {
   currentUser: User | null;
   isAuthReady: boolean;
   isWorking: boolean;
   signInWithEmail: (email: string, password: string) => Promise<void>;
   signUpWithEmail: (email: string, password: string) => Promise<void>;
   signInWithGoogle: () => Promise<void>;
   signOutCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
