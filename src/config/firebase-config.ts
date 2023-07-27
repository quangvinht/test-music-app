import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBolCLAlz6PdvJDCHb3vDvVtaghy7cKSOg",
  authDomain: "test-music-app-6e715.firebaseapp.com",
  projectId: "test-music-app-6e715",
  storageBucket: "test-music-app-6e715.appspot.com",
  messagingSenderId: "452036200596",
  appId: "1:452036200596:web:51364e6608b1c74dc3cc81",
  measurementId: "G-J3CDXWK44K",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export default app;
