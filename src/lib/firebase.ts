import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, type Functions } from "firebase/functions";
import { getFirebaseConfig } from "./env";

const config = getFirebaseConfig();
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;
const missingKeys = requiredKeys.filter((key) => !config[key]);

if (missingKeys.length > 0) {
  console.warn(
    `Firebase config is incomplete. Missing keys: ${missingKeys.join(", ")}. Add VITE_FIREBASE_* values in .env.`,
  );
}

export const isFirebaseConfigured = missingKeys.length === 0;
export const firebaseConfigError = isFirebaseConfigured
  ? null
  : "إعدادات Firebase غير مكتملة. أنشئي ملف .env وأضيفي VITE_FIREBASE_API_KEY و VITE_FIREBASE_AUTH_DOMAIN و VITE_FIREBASE_PROJECT_ID و VITE_FIREBASE_APP_ID.";

const app = initializeApp({
  apiKey: config.apiKey ?? "missing-api-key",
  authDomain: config.authDomain ?? "missing-auth-domain",
  projectId: config.projectId ?? "missing-project-id",
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId ?? "missing-app-id",
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

let functionsSingleton: Functions | null = null;

export function getFirebaseFunctions(): Functions {
  if (!functionsSingleton) {
    const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION ?? "us-central1";
    functionsSingleton = getFunctions(app, region);
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === "true") {
      connectFunctionsEmulator(functionsSingleton, "127.0.0.1", 5001);
    }
  }
  return functionsSingleton;
}
