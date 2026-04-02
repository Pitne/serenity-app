import Constants from "expo-constants";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function getFirebaseConfig(): FirebaseConfig {
  const extra = Constants.expoConfig?.extra;

  if (!extra) {
    throw new Error(
      "Firebase config not found. Check app.config.js and .env file."
    );
  }

  const required: Array<keyof typeof extra> = [
    "firebaseApiKey",
    "firebaseAuthDomain",
    "firebaseProjectId",
    "firebaseStorageBucket",
    "firebaseMessagingSenderId",
    "firebaseAppId",
  ];

  for (const key of required) {
    if (!extra[key]) {
      throw new Error(
        `Missing Firebase config key: ${key}. Check .env and app.config.js.`
      );
    }
  }

  return {
    apiKey: extra.firebaseApiKey as string,
    authDomain: extra.firebaseAuthDomain as string,
    projectId: extra.firebaseProjectId as string,
    storageBucket: extra.firebaseStorageBucket as string,
    messagingSenderId: extra.firebaseMessagingSenderId as string,
    appId: extra.firebaseAppId as string,
  };
}

// Prevent re-initialization on Expo hot-reload
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApp();

const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };
