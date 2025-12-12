import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCxX__w24YTtGGd7UigvpvI4nUWlXhRXbI",
    authDomain: "voice2text-genai-app.firebaseapp.com",
    projectId: "voice2text-genai-app",
    storageBucket: "voice2text-genai-app.firebasestorage.app",
    messagingSenderId: "148140268958",
    appId: "1:148140268958:web:7a84d9dd025f1098238a8f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
