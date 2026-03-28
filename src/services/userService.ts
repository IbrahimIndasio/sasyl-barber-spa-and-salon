import type { User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled, firebaseSetupMessage } from '../lib/firebase';
import type { UserProfile, UserRole } from '../types';

export interface CreateUserProfileInput {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role?: UserRole;
}

function getUserRef(uid: string) {
  if (!firebaseEnabled || !db) {
    throw new Error(firebaseSetupMessage);
  }

  return doc(db, 'users', uid);
}

export function normalizeUserProfile(uid: string, data?: DocumentData, authUser?: User | null): UserProfile {
  const createdAtValue = data?.createdAt;
  const createdAt =
    typeof createdAtValue === 'string'
      ? createdAtValue
      : typeof createdAtValue?.toDate === 'function'
        ? createdAtValue.toDate().toISOString()
        : new Date().toISOString();

  const name =
    (typeof data?.name === 'string' && data.name.trim()) ||
    (typeof data?.displayName === 'string' && data.displayName.trim()) ||
    authUser?.displayName ||
    authUser?.email?.split('@')[0] ||
    'Client';

  const role: UserRole =
    data?.role === 'admin' || data?.role === 'staff' || data?.role === 'client'
      ? data.role
      : 'client';

  return {
    uid,
    name,
    displayName:
      (typeof data?.displayName === 'string' && data.displayName.trim()) || name,
    email:
      (typeof data?.email === 'string' && data.email.trim()) ||
      authUser?.email ||
      '',
    phone:
      (typeof data?.phone === 'string' && data.phone.trim()) || '',
    photoURL:
      (typeof data?.photoURL === 'string' && data.photoURL.trim()) ||
      authUser?.photoURL ||
      '',
    role,
    createdAt,
  };
}

export async function getUserProfile(uid: string, authUser?: User | null) {
  const userSnapshot = await getDoc(getUserRef(uid));
  if (!userSnapshot.exists()) {
    return null;
  }

  return normalizeUserProfile(uid, userSnapshot.data(), authUser);
}

export async function createUserProfile(input: CreateUserProfileInput) {
  await setDoc(getUserRef(input.uid), {
    uid: input.uid,
    name: input.name,
    displayName: input.name,
    email: input.email,
    phone: input.phone ?? '',
    photoURL: input.photoURL ?? '',
    role: input.role ?? 'client',
    createdAt: serverTimestamp(),
  });
}

export async function ensureUserProfile(authUser: User) {
  const existingProfile = await getUserProfile(authUser.uid, authUser);
  if (existingProfile) {
    return existingProfile;
  }

  await createUserProfile({
    uid: authUser.uid,
    name: authUser.displayName || authUser.email?.split('@')[0] || 'Client',
    email: authUser.email || '',
    phone: '',
    photoURL: authUser.photoURL || '',
    role: 'client',
  });

  return getUserProfile(authUser.uid, authUser);
}

export function subscribeToUserProfile(
  uid: string,
  authUser: User,
  onData: (profile: UserProfile | null) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    getUserRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }

      onData(normalizeUserProfile(uid, snapshot.data(), authUser));
    },
    (error) => {
      onError(error);
    },
  );
}
