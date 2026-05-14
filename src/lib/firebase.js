import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added these

const firebaseConfig = {
  apiKey: "AIzaSyBVPnxv92jfanKyVm39sWwg6DArUbozGV4",
  authDomain: "explified-app.firebaseapp.com",
  databaseURL: "https://explified-app.firebaseio.com",
  projectId: "explified-app",
  storageBucket: "explified-app.appspot.com",
  messagingSenderId: "901696391731",
  appId: "1:901696391731:web:cc7fdab6bb43b23388b146",
  measurementId: "G-MKQECZX6Q7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
