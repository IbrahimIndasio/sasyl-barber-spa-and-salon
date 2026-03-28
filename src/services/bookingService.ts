import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, firebaseEnabled, firebaseSetupMessage } from '../lib/firebase';
import { normalizeBookingSnapshot } from '../lib/bookings';
import type { Booking } from '../types';

export interface CreateBookingInput {
  userId: string;
  email?: string;
  name?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: Date;
  time: string;
  notes?: string;
}

function getBookingsCollection() {
  if (!firebaseEnabled || !db) {
    throw new Error(firebaseSetupMessage);
  }

  return collection(db, 'bookings');
}

function sortByDateDescending(bookings: Booking[]) {
  return [...bookings].sort((left, right) => {
    const leftTime = new Date(left.date).getTime();
    const rightTime = new Date(right.date).getTime();
    return rightTime - leftTime;
  });
}

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

export async function getAllBookings() {
  const bookingsQuery = query(getBookingsCollection(), orderBy('date', 'desc'));
  const snapshot = await getDocs(bookingsQuery);
  return snapshot.docs.map(normalizeBookingSnapshot);
}

export async function getBookingsByUser(userId: string) {
  const bookingsQuery = query(getBookingsCollection(), where('userId', '==', userId));
  const snapshot = await getDocs(bookingsQuery);
  return sortByDateDescending(snapshot.docs.map(normalizeBookingSnapshot));
}

export async function createBooking(input: CreateBookingInput) {
  const bookingDate = buildBookingDate(input.date, input.time);

  const docRef = await addDoc(getBookingsCollection(), {
    userId: input.userId,
    userEmail: input.email ?? '',
    name: input.name ?? 'Client',
    userName: input.name ?? 'Client',
    serviceId: input.serviceId,
    service: input.serviceName,
    serviceName: input.serviceName,
    price: input.price,
    date: Timestamp.fromDate(bookingDate),
    time: input.time,
    status: 'pending',
    notes: input.notes ?? '',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export function subscribeToAllBookings(
  onData: (bookings: Booking[]) => void,
  onError?: (error: Error) => void,
) {
  const bookingsQuery = query(getBookingsCollection(), orderBy('date', 'desc'));

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      onData(snapshot.docs.map(normalizeBookingSnapshot));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  if (!db) {
    throw new Error(firebaseSetupMessage);
  }

  await updateDoc(doc(db, 'bookings', id), { status });
}
