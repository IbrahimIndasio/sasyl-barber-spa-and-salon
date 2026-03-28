import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToAllBookings, updateBookingStatus } from '../services/bookingService';
import type { Booking } from '../types';
import { cn } from '../lib/utils';

export default function Staff() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAllBookings(
      (nextBookings) => {
        setBookings(nextBookings);
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
  }, []);

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(id, status);
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update booking status.');
    }
  };

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
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold uppercase">
                {user?.displayName?.trim()?.[0] || user?.email?.trim()?.[0] || 'S'}
              </div>
            )}
            <div>
              <p className="font-bold">{profile?.name || user?.displayName || 'Staff'}</p>
              <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">{profile?.role || 'staff'}</p>
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
                          {new Date(booking.date).toLocaleDateString()} at {booking.time || new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{booking.serviceName || booking.service}</h3>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <User className="h-4 w-4" />
                        <span>{booking.userName || booking.name} {booking.userEmail ? `(${booking.userEmail})` : ''}</span>
                      </div>
                      {typeof booking.price === 'number' && (
                        <p className="mt-2 text-sm text-orange-500">KES {booking.price}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => {
                          void handleStatusChange(booking.id, 'confirmed');
                        }}
                        className="flex-1 md:flex-none bg-green-500 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-400 transition-all"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          void handleStatusChange(booking.id, 'completed');
                        }}
                        className="flex-1 md:flex-none bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-400 transition-all"
                      >
                        Complete
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          void handleStatusChange(booking.id, 'cancelled');
                        }}
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
