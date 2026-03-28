import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, firebaseEnabled, firebaseSetupMessage, getFirebaseAuthErrorMessage, googleProvider } from '../lib/firebase';
import { createUserProfile, ensureUserProfile, normalizeUserProfile, subscribeToUserProfile } from '../services/userService';
import type { UserProfile, UserRole } from '../types';

export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  isStaff: boolean;
  isClient: boolean;
  loginWithGoogle: () => Promise<'popup' | 'redirect'>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupClient: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
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
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    void getRedirectResult(auth).catch((error) => {
      console.error('Error completing redirect sign-in:', error);
      setAuthError(getFirebaseAuthErrorMessage(error));
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
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

      try {
        const ensuredProfile = await ensureUserProfile(firebaseUser);
        if (ensuredProfile) {
          setProfile(ensuredProfile);
        } else {
          setProfile(normalizeUserProfile(firebaseUser.uid, undefined, firebaseUser));
        }

        unsubscribeProfile = subscribeToUserProfile(
          firebaseUser.uid,
          firebaseUser,
          (nextProfile) => {
            setProfile(nextProfile ?? normalizeUserProfile(firebaseUser.uid, undefined, firebaseUser));
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching profile:', error);
            setProfile(normalizeUserProfile(firebaseUser.uid, undefined, firebaseUser));
            setAuthError(getFirebaseAuthErrorMessage(error));
            setLoading(false);
          },
        );
      } catch (error) {
        console.error('Error ensuring profile:', error);
        setProfile(normalizeUserProfile(firebaseUser.uid, undefined, firebaseUser));
        setAuthError(error instanceof Error ? error.message : getFirebaseAuthErrorMessage(error));
        setLoading(false);
      }
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

  const loginWithEmail = async (email: string, password: string) => {
    if (!firebaseEnabled || !auth) {
      throw new Error(firebaseSetupMessage);
    }

    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email sign-in failed:', error);
      const message = getFirebaseAuthErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  };

  const signupClient = async (input: SignupInput) => {
    if (!firebaseEnabled || !auth) {
      throw new Error(firebaseSetupMessage);
    }

    setAuthError(null);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(credentials.user, { displayName: input.name });
      await createUserProfile({
        uid: credentials.user.uid,
        name: input.name,
        email: input.email,
        phone: input.phone,
        photoURL: credentials.user.photoURL ?? '',
        role: 'client',
      });
    } catch (error) {
      console.error('Client signup failed:', error);
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

  const role = profile?.role ?? null;
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isClient = role === 'client';

  return {
    user,
    profile,
    role,
    loading,
    authError,
    isAdmin,
    isStaff,
    isClient,
    loginWithGoogle,
    loginWithEmail,
    signupClient,
    logout,
  };
}
