import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuração do Firebase (usando valores de exemplo que o usuário deve substituir se necessário, 
// mas para o propósito de build e demonstração, estes bastam)
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-For-Build-Purposes",
  authDomain: "tvde-finance.firebaseapp.com",
  projectId: "tvde-finance",
  storageBucket: "tvde-finance.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
