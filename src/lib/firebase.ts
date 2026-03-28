import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import fallbackConfig from '../../firebase-applet-config.json';

type FirebaseClientConfig = FirebaseOptions & {
  firestoreDatabaseId?: string;
};

export const firebaseSetupMessage =
  'Firebase is not configured. Add VITE_FIREBASE_* values to .env.local or update firebase-applet-config.json.';

function getCurrentHost() {
  return typeof window !== 'undefined' ? window.location.hostname : 'this domain';
}

export function getFirebaseAuthErrorMessage(error: unknown) {
  const errorCode =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';

  if (errorCode === 'auth/unauthorized-domain') {
    return `Google sign-in is blocked for ${getCurrentHost()}. In Firebase Console > Authentication > Settings > Authorized domains, add ${getCurrentHost()} and try again.`;
  }

  if (errorCode === 'auth/popup-closed-by-user') {
    return 'The Google sign-in popup was closed before login completed.';
  }

  if (errorCode === 'auth/popup-blocked') {
    return 'Your browser blocked the Google sign-in popup. Allow popups for this site and try again.';
  }

  if (errorCode === 'auth/network-request-failed') {
    return 'A network error interrupted Google sign-in. Check your connection and try again.';
  }

  if (errorCode === 'auth/cancelled-popup-request') {
    return 'Another sign-in request is already in progress. Wait a moment and try again.';
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Unable to sign in right now.';
}

function normalizeConfig(config?: FirebaseClientConfig | null): FirebaseClientConfig | null {
  if (!config) {
    return null;
  }

  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
  const hasRequiredFields = requiredFields.every((field) => {
    const value = config[field];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (!hasRequiredFields) {
    return null;
  }

  return {
    apiKey: config.apiKey!.trim(),
    authDomain: config.authDomain!.trim(),
    projectId: config.projectId!.trim(),
    appId: config.appId!.trim(),
    storageBucket: config.storageBucket?.trim() || undefined,
    messagingSenderId: config.messagingSenderId?.trim() || undefined,
    measurementId: config.measurementId?.trim() || undefined,
    firestoreDatabaseId: config.firestoreDatabaseId?.trim() || undefined,
  };
}

const envConfig = normalizeConfig({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID,
});

const bundledConfig = normalizeConfig(fallbackConfig as FirebaseClientConfig);
const firebaseConfig = envConfig ?? bundledConfig;
export const firebaseConfigSource = envConfig ? 'env' : bundledConfig ? 'fallback' : 'missing';

export const firebaseEnabled = Boolean(firebaseConfig);

if (firebaseConfigSource === 'fallback' && import.meta.env.PROD) {
  console.warn(
    'Using bundled Firebase config in production. Set VITE_FIREBASE_* variables in Vercel for a production-owned Firebase project.',
  );
}

const app = firebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app
  ? firebaseConfig?.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app)
  : null;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
