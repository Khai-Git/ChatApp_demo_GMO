import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-20a34.firebaseapp.com",
  projectId: "chatapp-20a34",
  storageBucket: "chatapp-20a34.appspot.com",
  messagingSenderId: "777316754336",
  appId: "1:777316754336:web:5b86d92d84357ca33b3ac5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)