import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3Yq5L3mZBWhCdTc47KoymI7AfMir9HcQ",
  authDomain: "tvde-finance.firebaseapp.com",
  projectId: "tvde-finance",
  storageBucket: "tvde-finance.firebasestorage.app",
  messagingSenderId: "31556204962",
  appId: "1:31556204962:web:faad3f31053c06f6e7dafb",
  measurementId: "G-T3ZMWC03YD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
