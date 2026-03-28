import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Chrome, LockKeyhole, Mail, Scissors, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { clearPostLoginPath, getPostLoginPath, resolvePostLoginPath, setPostLoginPath } from '../lib/authRedirect';

function getRequestedPath(state: unknown) {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string'
  ) {
    return state.from;
  }

  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    role,
    loading,
    authError,
    loginWithEmail,
    loginWithGoogle,
  } = useAuth();

  const requestedPath = useMemo(() => getRequestedPath(location.state), [location.state]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<'google' | 'email' | null>(null);

  useEffect(() => {
    if (requestedPath) {
      setPostLoginPath(requestedPath);
    }
  }, [requestedPath]);

  useEffect(() => {
    if (loading || !user || !role) {
      return;
    }

    const fallbackPath = getPostLoginPath();
    const destination = resolvePostLoginPath(role, fallbackPath);
    clearPostLoginPath();
    navigate(destination, { replace: true });
  }, [loading, navigate, role, user]);

  const handleGoogleLogin = async () => {
    const fallbackPath = requestedPath || getPostLoginPath();
    if (fallbackPath) {
      setPostLoginPath(fallbackPath);
    }

    setSubmitting('google');
    setErrorMessage(null);

    try {
      await loginWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
      setSubmitting(null);
    }
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fallbackPath = requestedPath || getPostLoginPath();
    if (fallbackPath) {
      setPostLoginPath(fallbackPath);
    }

    setSubmitting('email');
    setErrorMessage(null);

    try {
      await loginWithEmail(email.trim(), password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[40px] border border-white/10 bg-white/5 p-8 md:p-12"
        >
          <div className="mb-8 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Sasyl Access</p>
              <h1 className="text-4xl font-bold tracking-tighter uppercase md:text-5xl">One Login For Everyone</h1>
            </div>
          </div>

          <p className="max-w-xl text-white/55">
            Use Google sign-in for staff and admin access, or email and password for client accounts. Your role is loaded from Firestore after authentication.
          </p>

          <div className="mt-10 space-y-5">
            {[
              'Admin users are redirected to the admin dashboard.',
              'Staff users are redirected to the staff workspace.',
              'Clients continue to booking or return to the home experience.',
            ].map((item) => (
              <div key={item} className="flex items-start space-x-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <p className="text-sm text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[40px] border border-white/10 bg-zinc-950 p-8 md:p-12"
        >
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Login</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tighter">Access Your Account</h2>
          </div>

          {(errorMessage || authError) && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage || authError}
            </div>
          )}

          <button
            onClick={() => {
              void handleGoogleLogin();
            }}
            disabled={submitting !== null}
            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-orange-500 px-6 py-4 font-bold uppercase tracking-widest text-black transition-all hover:bg-orange-400 disabled:opacity-50"
          >
            <Chrome className="h-5 w-5" />
            <span>{submitting === 'google' ? 'Opening Google...' : 'Continue with Google'}</span>
          </button>

          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-white/10" />
            <span className="px-4 text-xs font-bold uppercase tracking-[0.3em] text-white/35">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Email</span>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <Mail className="mr-3 h-5 w-5 text-orange-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Password</span>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <LockKeyhole className="mr-3 h-5 w-5 text-orange-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="Enter your password"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting !== null}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold uppercase tracking-widest text-white transition-all hover:border-orange-500 hover:bg-orange-500 hover:text-black disabled:opacity-50"
            >
              {submitting === 'email' ? 'Signing In...' : 'Login with Email'}
            </button>
          </form>

          <p className="mt-8 text-sm text-white/50">
            New client?
            {' '}
            <Link to="/signup" state={requestedPath ? { from: requestedPath } : undefined} className="font-bold text-orange-500 hover:text-orange-400">
              Create an account
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
