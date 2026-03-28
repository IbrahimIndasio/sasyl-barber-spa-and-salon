import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, LayoutDashboard, LogIn, User, XCircle } from 'lucide-react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, firebaseEnabled, firebaseSetupMessage, signInWithGoogle } from '../lib/firebase';
import { Booking } from '../types';
import { normalizeBookingSnapshot } from '../lib/bookings';
import { cn } from '../lib/utils';

export default function Staff() {
  const { user, profile, isAdmin, isStaff, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    }
  };

  useEffect(() => {
    if (!firebaseEnabled || !db) {
      setLoading(false);
      return;
    }

    if (!isStaff) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const bookingsQuery = query(collection(db, 'bookings'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        setBookings(snapshot.docs.map(normalizeBookingSnapshot));
        setLoading(false);
        setErrorMessage(null);
      },
      (error) => {
        console.error('Error loading bookings:', error);
        setErrorMessage(error.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isStaff]);

  const updateStatus = async (id: string, status: Booking['status']) => {
    if (!db) {
      return;
    }

    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update booking status.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center">
          <LogIn className="h-16 w-16 text-orange-500 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Staff Portal</h1>
          <p className="text-white/50 mb-10">
            {firebaseEnabled
              ? 'Please login with your staff account to access the dashboard.'
              : firebaseSetupMessage}
          </p>
          {errorMessage && <p className="mb-6 text-sm text-red-300">{errorMessage}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-black py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-400 transition-all disabled:opacity-50"
            disabled={!firebaseEnabled}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Access Denied</h1>
          <p className="text-white/50 mb-10">You do not have permission to access the staff portal. Please contact an administrator.</p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full bg-white text-black py-4 rounded-full font-bold uppercase tracking-widest"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24">
      <section className="pt-32 pb-12 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <LayoutDashboard className="h-6 w-6 text-orange-500" />
              <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs">Staff Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">Manage Bookings</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-orange-300 transition-all hover:border-orange-400 hover:bg-orange-500 hover:text-black"
              >
                Open Admin Reports
              </Link>
            )}
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold uppercase">
                  {user.displayName?.trim()?.[0] || user.email?.trim()?.[0] || 'S'}
                </div>
              )}
              <div>
                <p className="font-bold">{user.displayName || profile?.displayName || 'Staff'}</p>
                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">{profile?.role || 'staff'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {errorMessage && (
            <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/10">
              <Calendar className="h-16 w-16 text-white/10 mx-auto mb-6" />
              <p className="text-white/40">No bookings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-white/20 transition-all"
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={cn(
                        'h-16 w-16 rounded-2xl flex items-center justify-center shrink-0',
                        booking.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-500'
                          : booking.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-500'
                            : booking.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-orange-500/10 text-orange-500',
                      )}
                    >
                      <Calendar className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                            booking.status === 'confirmed'
                              ? 'bg-green-500 text-black'
                              : booking.status === 'cancelled'
                                ? 'bg-red-500 text-white'
                                : booking.status === 'completed'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-orange-500 text-black',
                          )}
                        >
                          {booking.status}
                        </span>
                        <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
                          {new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{booking.serviceName}</h3>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <User className="h-4 w-4" />
                        <span>{booking.userName} ({booking.userEmail})</span>
                      </div>
                      {typeof booking.price === 'number' && (
                        <p className="mt-2 text-sm text-orange-500">KES {booking.price}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="flex-1 md:flex-none bg-green-500 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-400 transition-all"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'completed')}
                        className="flex-1 md:flex-none bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-all"
                      >
                        Complete
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white/50 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
