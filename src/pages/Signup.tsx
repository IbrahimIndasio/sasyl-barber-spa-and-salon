import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Phone, Scissors, UserRound } from 'lucide-react';
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

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, authError, signupClient } = useAuth();
  const requestedPath = useMemo(() => getRequestedPath(location.state), [location.state]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (requestedPath) {
      setPostLoginPath(requestedPath);
    }
  }, [requestedPath]);

  useEffect(() => {
    if (loading || !user || !role) {
      return;
    }

    const fallbackPath = getPostLoginPath() || '/booking';
    const destination = resolvePostLoginPath(role, fallbackPath);
    clearPostLoginPath();
    navigate(destination, { replace: true });
  }, [loading, navigate, role, user]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fallbackPath = requestedPath || getPostLoginPath() || '/booking';
    setPostLoginPath(fallbackPath);

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await signupClient({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create your account right now.');
      setSubmitting(false);
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Client Signup</p>
              <h1 className="text-4xl font-bold tracking-tighter uppercase md:text-5xl">Create Your Account</h1>
            </div>
          </div>

          <p className="max-w-xl text-white/55">
            Create a client account once, then use email and password for future bookings. Google sign-in remains available from the login page.
          </p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/35">What happens next</p>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              <li>Your Firebase Authentication account is created.</li>
              <li>Your Firestore `users/{'{'}uid{'}'}` document is saved with role `client`.</li>
              <li>After signup, you return to booking or the homepage depending on where you came from.</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[40px] border border-white/10 bg-zinc-950 p-8 md:p-12"
        >
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Signup</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tighter">Client Registration</h2>
          </div>

          {(errorMessage || authError) && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage || authError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Full Name</span>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <UserRound className="mr-3 h-5 w-5 text-orange-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="Your full name"
                />
              </div>
            </label>

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
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Phone Number</span>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <Phone className="mr-3 h-5 w-5 text-orange-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="07xx xxx xxx"
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
                  minLength={6}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  placeholder="Create a password"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-orange-500 px-6 py-4 font-bold uppercase tracking-widest text-black transition-all hover:bg-orange-400 disabled:opacity-50"
            >
              {submitting ? 'Creating Account...' : 'Create Client Account'}
            </button>
          </form>

          <p className="mt-8 text-sm text-white/50">
            Already registered?
            {' '}
            <Link to="/login" state={requestedPath ? { from: requestedPath } : undefined} className="font-bold text-orange-500 hover:text-orange-400">
              Login here
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
