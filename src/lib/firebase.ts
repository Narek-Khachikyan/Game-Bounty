import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
   apiKey: 'AIzaSyBl8rQ0mACXKwWNV-iF1-XOIcscHr6vhxw',
   authDomain: 'gamebounty-35933.firebaseapp.com',
   projectId: 'gamebounty-35933',
   storageBucket: 'gamebounty-35933.firebasestorage.app',
   messagingSenderId: '531854466219',
   appId: '1:531854466219:web:9498079f5f305f1332ebee',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
   prompt: 'select_account',
});

export { firebaseApp, firebaseAuth, googleAuthProvider };
