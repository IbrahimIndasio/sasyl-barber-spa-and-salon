import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Clock, Scissors, Sparkles, Star } from 'lucide-react';
import { Timestamp, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db, firebaseEnabled, firebaseSetupMessage, signInWithGoogle } from '../lib/firebase';
import { cn } from '../lib/utils';

const services = [
  { id: 'm-cut', name: "Men's Haircut", price: 800, category: 'Barbering', icon: Scissors },
  { id: 'b-trim', name: 'Beard Trimming', price: 500, category: 'Barbering', icon: Scissors },
  { id: 'h-shave', name: 'Hot Towel Shave', price: 1000, category: 'Barbering', icon: Scissors },
  { id: 'braid', name: 'Braiding', price: 2500, category: 'Hair Salon', icon: Sparkles },
  { id: 'natural', name: 'Natural Styling', price: 2000, category: 'Hair Salon', icon: Sparkles },
  { id: 'massage', name: 'Full Body Massage', price: 3500, category: 'Spa', icon: Star },
  { id: 'moroccan', name: 'Moroccan Bath', price: 4500, category: 'Spa', icon: Star },
];

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
];

function buildBookingDate(date: Date, time: string) {
  const [hourText, minuteText] = time.split(':');
  const [minuteValue, period] = minuteText.split(' ');
  let hours = Number.parseInt(hourText, 10);
  const minutes = Number.parseInt(minuteValue, 10);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  const bookingDate = new Date(date);
  bookingDate.setHours(hours, minutes, 0, 0);
  return bookingDate;
}

export default function Booking() {
  const { user, profile, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    }
  };

  const handleBooking = async () => {
    if (!user || !db || !selectedService || !selectedDate || !selectedTime) {
      return;
    }

    setBookingStatus('submitting');
    setErrorMessage(null);

    try {
      const bookingDate = buildBookingDate(selectedDate, selectedTime);

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        userEmail: user.email ?? profile?.email ?? '',
        userName: user.displayName ?? profile?.displayName ?? 'Client',
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price,
        date: Timestamp.fromDate(bookingDate),
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setBookingStatus('success');
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to complete your booking.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-24">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 uppercase">Book Appointment</h1>
            <p className="text-white/50">Follow the steps below to secure your spot at Sasyl.</p>
          </motion.div>

          {!firebaseEnabled && (
            <div className="mb-10 rounded-3xl border border-orange-500/30 bg-orange-500/10 p-6 text-left">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <p className="text-sm leading-relaxed text-orange-100">
                  {firebaseSetupMessage} Booking and Google sign-in stay disabled until Firebase is configured.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-10 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500',
                  step >= i ? 'bg-orange-500 text-black scale-110' : 'bg-zinc-900 text-white/40 border border-white/10',
                )}
              >
                {i}
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-8">1. Select Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          'flex items-center p-6 rounded-2xl border transition-all text-left group',
                          selectedService?.id === service.id
                            ? 'bg-orange-500 border-orange-500 text-black'
                            : 'bg-white/5 border-white/10 hover:border-orange-500/50',
                        )}
                      >
                        <service.icon className={cn('h-8 w-8 mr-6', selectedService?.id === service.id ? 'text-black' : 'text-orange-500')} />
                        <div className="flex-1">
                          <p className={cn('text-xs font-bold uppercase tracking-widest mb-1', selectedService?.id === service.id ? 'text-black/60' : 'text-white/40')}>
                            {service.category}
                          </p>
                          <h4 className="font-bold text-lg">{service.name}</h4>
                        </div>
                        <span className="font-bold">KES {service.price}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end pt-8">
                    <button
                      disabled={!selectedService}
                      onClick={() => setStep(2)}
                      className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-8">2. Date & Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Select Date
                      </label>
                      <div className="booking-datepicker">
                        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline minDate={new Date()} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Select Time
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              'py-3 rounded-xl border text-sm font-bold transition-all',
                              selectedTime === time
                                ? 'bg-orange-500 border-orange-500 text-black'
                                : 'bg-white/5 border-white/10 hover:border-orange-500/50 text-white/60',
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="text-white/50 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(3)}
                      className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <span>Review Booking</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-8">3. Review & Confirm</h3>

                  {bookingStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-black" />
                      </div>
                      <h4 className="text-3xl font-bold mb-4">Booking Confirmed!</h4>
                      <p className="text-white/50 mb-12 max-w-md mx-auto">
                        Your appointment has been saved successfully. The staff dashboard can now manage it in Firestore.
                      </p>
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-left max-w-md mx-auto mb-12">
                        <div className="flex justify-between mb-4">
                          <span className="text-white/40">Service</span>
                          <span className="font-bold">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="text-white/40">Date</span>
                          <span className="font-bold">{selectedDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Time</span>
                          <span className="font-bold">{selectedTime}</span>
                        </div>
                      </div>
                      <button onClick={() => { window.location.href = '/'; }} className="bg-orange-500 text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest">
                        Return Home
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <Scissors className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Service</p>
                              <h4 className="text-xl font-bold">{selectedService?.name}</h4>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Date & Time</p>
                              <h4 className="text-xl font-bold">{selectedDate?.toLocaleDateString()} at {selectedTime}</h4>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Total Price</span>
                            <span className="text-3xl font-bold text-orange-500">KES {selectedService?.price}</span>
                          </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-zinc-900 border border-white/10">
                          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Customer Details</h4>
                          {user ? (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                {user.photoURL ? (
                                  <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-bold uppercase">
                                    {user.displayName?.trim()?.[0] || user.email?.trim()?.[0] || 'S'}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold">{user.displayName || profile?.displayName || 'Client'}</p>
                                  <p className="text-white/40 text-sm">{user.email || profile?.email || 'No email available'}</p>
                                </div>
                              </div>
                              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-500/80 leading-relaxed">
                                  Please arrive 10 minutes before your scheduled time. Cancellations must be made at least 24 hours in advance.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-white/50 mb-6">Please login to complete your booking.</p>
                              <button onClick={handleLogin} className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-50" disabled={!firebaseEnabled}>
                                Login with Google
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between pt-8">
                        <button
                          onClick={() => setStep(2)}
                          className="text-white/50 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                        >
                          Back
                        </button>
                        <button
                          disabled={!user || !db || bookingStatus === 'submitting'}
                          onClick={handleBooking}
                          className="bg-orange-500 text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-orange-400 transition-all disabled:opacity-50 flex items-center space-x-3"
                        >
                          <span>{bookingStatus === 'submitting' ? 'Confirming...' : 'Confirm Booking'}</span>
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
