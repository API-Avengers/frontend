import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxvbbyFJVlre8ofqxh2SJDmb1BrzbnQY0",
    authDomain: "api-avengers-d3447.firebaseapp.com",
    projectId: "api-avengers-d3447",
    storageBucket: "api-avengers-d3447.appspot.com",
    messagingSenderId: "939684499074",
    appId: "1:939684499074:web:791b6d905b3fb161f62e9b",
    measurementId: "G-KT4937VB19"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
  }
};

const getUserInfo = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  });
};

const logout = async () => {
  await signOut(auth);
};

export { auth, signInWithGoogle, getUserInfo, logout };
