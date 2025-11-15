// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0ax-_TFuFsoDXS70EOUYl__JvtdPJVQY",
  authDomain: "craft-hindustan.firebaseapp.com",
  projectId: "craft-hindustan",
  storageBucket: "craft-hindustan.firebasestorage.app",
  messagingSenderId: "744919678192",
  appId: "1:744919678192:web:7d13f6adbe3db21a4e5635",
  measurementId: "G-SCSE0KQPLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;

