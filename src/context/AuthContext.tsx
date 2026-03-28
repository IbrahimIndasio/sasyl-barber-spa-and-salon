import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '../lib/firebase';
import { type UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAILS = new Set(['ibrahimliyai2@gmail.com']);

function isFallbackAdmin(user: User | null) {
  return Boolean(
    user?.email &&
      user.emailVerified &&
      ADMIN_EMAILS.has(user.email.toLowerCase()),
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
  } else if (isFallbackAdmin(user)) {
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

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
      const userRef = doc(db, 'users', firebaseUser.uid);

      unsubscribeProfile = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProfile(normalizeProfile(firebaseUser, docSnap.data()));
          } else {
            const newProfile = normalizeProfile(firebaseUser);
            void setDoc(
              userRef,
              {
                ...newProfile,
                createdAt: serverTimestamp(),
              },
              { merge: true },
            ).catch((error) => {
              console.error('Error creating profile:', error);
            });
            setProfile(newProfile);
          }

          setLoading(false);
        },
        (error) => {
          console.error('Error fetching profile:', error);
          setProfile(normalizeProfile(firebaseUser));
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const adminFromEmail = isFallbackAdmin(user);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' || adminFromEmail,
    isStaff: profile?.role === 'staff' || profile?.role === 'admin' || adminFromEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
