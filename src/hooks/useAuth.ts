import { useEffect, useState } from 'react';
import { getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled, firebaseSetupMessage, getFirebaseAuthErrorMessage, googleProvider } from '../lib/firebase';
import type { UserProfile } from '../types';

export const ADMIN_EMAILS = ['ibrahimliyai2@gmail.com'];
const ADMIN_EMAIL_SET = new Set(ADMIN_EMAILS.map((email) => email.toLowerCase()));

export type AuthRole = 'admin' | 'customer';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: AuthRole;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  isStaff: boolean;
  loginWithGoogle: () => Promise<'popup' | 'redirect'>;
  logout: () => Promise<void>;
}

function isWhitelistedAdmin(user: User | null) {
  return Boolean(
    user?.email &&
      user.emailVerified &&
      ADMIN_EMAIL_SET.has(user.email.toLowerCase()),
  );
}

function normalizeProfile(user: User, data?: DocumentData): UserProfile {
  const createdAtValue = data?.createdAt;
  const createdAt =
    typeof createdAtValue === 'string'
      ? createdAtValue
      : typeof createdAtValue?.toDate === 'function'
        ? createdAtValue.toDate().toISOString()
        : new Date().toISOString();

  let role: UserProfile['role'] = 'client';
  if (data?.role === 'client' || data?.role === 'staff' || data?.role === 'admin') {
    role = data.role;
  } else if (isWhitelistedAdmin(user)) {
    role = 'admin';
  }

  return {
    uid: user.uid,
    email: data?.email ?? user.email ?? '',
    displayName: data?.displayName ?? user.displayName ?? '',
    photoURL: data?.photoURL ?? user.photoURL ?? '',
    role,
    createdAt,
  };
}

function shouldFallbackToRedirect(error: unknown) {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : '';

  return code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request';
}

export function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseEnabled || !auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    void getRedirectResult(auth).catch((error) => {
      console.error('Error completing redirect sign-in:', error);
      setAuthError(getFirebaseAuthErrorMessage(error));
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = null;
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setAuthError(null);
      const userRef = doc(db, 'users', firebaseUser.uid);

      unsubscribeProfile = onSnapshot(
        userRef,
        (docSnap) => {
          const normalizedProfile = normalizeProfile(firebaseUser, docSnap.data());
          setProfile(normalizedProfile);

          if (!docSnap.exists()) {
            void setDoc(
              userRef,
              {
                ...normalizedProfile,
                createdAt: serverTimestamp(),
              },
              { merge: true },
            ).catch((error) => {
              console.error('Error creating profile:', error);
            });
          }

          setLoading(false);
        },
        (error) => {
          console.error('Error fetching profile:', error);
          setProfile(normalizeProfile(firebaseUser));
          setAuthError(getFirebaseAuthErrorMessage(error));
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const loginWithGoogle = async (): Promise<'popup' | 'redirect'> => {
    if (!firebaseEnabled || !auth) {
      throw new Error(firebaseSetupMessage);
    }

    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
      return 'popup';
    } catch (error) {
      console.error('Google popup sign-in failed:', error);

      if (shouldFallbackToRedirect(error)) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return 'redirect';
        } catch (redirectError) {
          console.error('Google redirect sign-in failed:', redirectError);
          const message = getFirebaseAuthErrorMessage(redirectError);
          setAuthError(message);
          throw new Error(message);
        }
      }

      const message = getFirebaseAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    if (!auth) {
      return;
    }

    setAuthError(null);
    await signOut(auth);
  };

  const adminFromEmail = isWhitelistedAdmin(user);
  const isAdmin = profile?.role === 'admin' || adminFromEmail;
  const isStaff = profile?.role === 'staff' || isAdmin;
  const role: AuthRole = isAdmin ? 'admin' : 'customer';

  return {
    user,
    profile,
    role,
    loading,
    authError,
    isAdmin,
    isStaff,
    loginWithGoogle,
    logout,
  };
}
