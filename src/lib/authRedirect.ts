import type { UserRole } from '../types';

const STORAGE_KEY = 'sasyl-auth-redirect';

export function setPostLoginPath(path: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, path);
}

export function getPostLoginPath() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(STORAGE_KEY);
}

export function clearPostLoginPath() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function resolvePostLoginPath(role: UserRole | null, fallbackPath?: string | null) {
  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'staff') {
    return '/staff';
  }

  return fallbackPath || '/';
}
