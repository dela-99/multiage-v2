import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Only initialize Firebase when the required config values are present.
// If VITE_FIREBASE_API_KEY is not set (e.g. the env var is missing in Vercel),
// getAuth() would throw "auth/invalid-api-key" at module load time and crash
// the entire React app, showing a blank white screen.
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export async function signInWithGooglePopup() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      "Google sign-in is not available because Firebase is not configured. " +
      "Please add the VITE_FIREBASE_* environment variables to your Vercel project settings."
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  return {
    name: result.user.displayName || "",
    email: result.user.email || "",
    photo: result.user.photoURL || "",
    uid: result.user.uid,
    idToken,
  };
}

export { auth, googleProvider };
export default app;
