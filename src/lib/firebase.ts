import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
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

function getFirebaseErrorMessage(error: unknown) {
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

export const firebaseEnabled = Boolean(firebaseConfig);

const app = firebaseConfig ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app
  ? firebaseConfig?.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app)
  : null;

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error(firebaseSetupMessage);
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const logout = () => (auth ? signOut(auth) : Promise.resolve());
