import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAfHofjsLtR0L9xrbv4rbKRTDYfieQBOUc",
    authDomain: "ff14-hunt.firebaseapp.com",
    projectId: "ff14-hunt",
    storageBucket: "ff14-hunt.firebasestorage.app",
    messagingSenderId: "685554694198",
    appId: "1:685554694198:web:6878dc79d6a5876e0d4097",
    measurementId: "G-55QRR4WL2E"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();