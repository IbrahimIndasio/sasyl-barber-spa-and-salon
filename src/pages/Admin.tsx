import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, firebaseEnabled, firebaseSetupMessage, signInWithGoogle } from '../lib/firebase';
import { getBookingMetrics, normalizeBookingSnapshot } from '../lib/bookings';
import type { Booking } from '../types';
import { cn } from '../lib/utils';

type BookingFilter = 'all' | Booking['status'];

const statusFilters: BookingFilter[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBookingDate(dateValue: string) {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return `${parsedDate.toLocaleDateString()} at ${parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export default function Admin() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');

  const metrics = useMemo(() => getBookingMetrics(bookings), [bookings]);
  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return bookings;
    }

    return bookings.filter((booking) => booking.status === activeFilter);
  }, [activeFilter, bookings]);

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

    if (!isAdmin) {
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
        console.error('Error loading admin data:', error);
        setErrorMessage(error.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

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
          <ShieldCheck className="h-16 w-16 text-orange-500 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-white/50 mb-10">
            {firebaseEnabled
              ? 'Login with an admin account to view reports and manage bookings.'
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[40px] p-12 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-8" />
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Admin Access Denied</h1>
          <p className="text-white/50 mb-6">
            Your signed-in account is not marked as an admin. Set `/users/{'{'}userId{'}'}.role` to `admin` in Firestore or use the configured admin account.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              to="/staff"
              className="w-full rounded-full bg-orange-500 px-6 py-4 text-center font-bold uppercase tracking-widest text-black transition-all hover:bg-orange-400"
            >
              Open Staff Dashboard
            </Link>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full rounded-full border border-white/10 px-6 py-4 font-bold uppercase tracking-widest text-white/60 transition-all hover:border-white/20 hover:text-white"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24">
      <section className="pt-32 pb-12 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <LayoutDashboard className="h-6 w-6 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Admin Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">Reports & Bookings</h1>
            <p className="mt-4 max-w-2xl text-white/50">
              Live operational view for appointments, revenue snapshots, and booking status management.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <Link
              to="/staff"
              className="rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-orange-300 transition-all hover:border-orange-400 hover:bg-orange-500 hover:text-black"
            >
              Open Staff View
            </Link>
            <div className="flex items-center space-x-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold uppercase">
                  {user.displayName?.trim()?.[0] || user.email?.trim()?.[0] || 'A'}
                </div>
              )}
              <div>
                <p className="font-bold">{user.displayName || profile?.displayName || 'Admin'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">{profile?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {errorMessage && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Total Bookings',
                value: metrics.totalBookings.toString(),
                detail: `${metrics.thisMonthBookings} this month`,
                icon: ClipboardList,
              },
              {
                label: 'Pending Queue',
                value: metrics.pendingBookings.toString(),
                detail: `${metrics.confirmedBookings} confirmed`,
                icon: CalendarClock,
              },
              {
                label: 'Today',
                value: metrics.todayBookings.toString(),
                detail: `${metrics.upcomingBookings} upcoming`,
                icon: BarChart3,
              },
              {
                label: 'Completed Revenue',
                value: formatCurrency(metrics.completedRevenue),
                detail: `${formatCurrency(metrics.scheduledRevenue)} scheduled`,
                icon: DollarSign,
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">{card.label}</span>
                  <card.icon className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                <p className="mt-2 text-sm text-white/45">{card.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Booking Reports</span>
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">Service Performance</h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">This Week</p>
                  <p className="text-lg font-bold">{metrics.thisWeekBookings} bookings</p>
                </div>
              </div>

              {metrics.topServices.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/45">
                  Service reporting will appear here once bookings start coming in.
                </p>
              ) : (
                <div className="space-y-4">
                  {metrics.topServices.map((service) => (
                    <div
                      key={service.name}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-lg font-bold">{service.name}</p>
                        <p className="text-sm text-white/45">{service.count} bookings recorded</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Tracked Revenue</p>
                        <p className="text-lg font-bold text-orange-400">{formatCurrency(service.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-6 flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Status Breakdown</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Pending', value: metrics.pendingBookings, tone: 'bg-orange-500/15 text-orange-300' },
                  { label: 'Confirmed', value: metrics.confirmedBookings, tone: 'bg-green-500/15 text-green-300' },
                  { label: 'Completed', value: metrics.completedBookings, tone: 'bg-blue-500/15 text-blue-300' },
                  { label: 'Cancelled', value: metrics.cancelledBookings, tone: 'bg-red-500/15 text-red-300' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                  >
                    <span className={cn('rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest', item.tone)}>
                      {item.label}
                    </span>
                    <span className="text-xl font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">Live Bookings</span>
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-tight">Manage Appointments</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all',
                      activeFilter === filter
                        ? 'border-orange-500 bg-orange-500 text-black'
                        : 'border-white/10 bg-black/30 text-white/55 hover:border-orange-500/40 hover:text-white',
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 py-20 text-center">
                <ClipboardList className="mx-auto mb-6 h-16 w-16 text-white/10" />
                <p className="text-white/45">No bookings match the current filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-black/30 p-6 transition-all hover:border-white/20 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest',
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
                        <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                          {formatBookingDate(booking.date)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{booking.serviceName}</h3>
                        <p className="text-sm text-white/50">
                          {booking.userName || 'Client'} {booking.userEmail ? `(${booking.userEmail})` : ''}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-white/45">
                        <span>Price: {formatCurrency(typeof booking.price === 'number' ? booking.price : 0)}</span>
                        <span>Booking ID: {booking.id}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 md:justify-end">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="rounded-xl bg-green-500 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-green-400"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'completed')}
                          className="rounded-xl bg-blue-500 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-400"
                        >
                          Complete
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/55 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
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
        </div>
      </section>
    </div>
  );
}
