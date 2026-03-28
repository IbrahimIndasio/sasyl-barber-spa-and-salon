import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Booking, BookingStatus } from '../types';

function parseBookingDate(dateValue: string) {
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function normalizeBookingRecord(id: string, data: DocumentData): Booking {
  const dateValue = data.date;
  const createdAtValue = data.createdAt;

  return {
    id,
    userId: data.userId ?? '',
    userEmail: data.userEmail ?? '',
    userName: data.userName ?? 'Client',
    serviceId: data.serviceId ?? '',
    serviceName: data.serviceName ?? 'Service',
    price: typeof data.price === 'number' ? data.price : 0,
    staffId: data.staffId,
    date:
      typeof dateValue === 'string'
        ? dateValue
        : typeof dateValue?.toDate === 'function'
          ? dateValue.toDate().toISOString()
          : new Date().toISOString(),
    status:
      data.status === 'confirmed' ||
      data.status === 'cancelled' ||
      data.status === 'completed'
        ? data.status
        : 'pending',
    notes: typeof data.notes === 'string' ? data.notes : undefined,
    createdAt:
      typeof createdAtValue === 'string'
        ? createdAtValue
        : typeof createdAtValue?.toDate === 'function'
          ? createdAtValue.toDate().toISOString()
          : undefined,
  };
}

export function normalizeBookingSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>) {
  return normalizeBookingRecord(snapshot.id, snapshot.data());
}

export function getBookingMetrics(bookings: Booking[]) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const statusCounts: Record<BookingStatus, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  };

  const serviceStats = new Map<string, { name: string; count: number; revenue: number }>();
  let todayBookings = 0;
  let thisWeekBookings = 0;
  let thisMonthBookings = 0;
  let upcomingBookings = 0;
  let scheduledRevenue = 0;
  let completedRevenue = 0;

  for (const booking of bookings) {
    statusCounts[booking.status] += 1;

    const bookingDate = parseBookingDate(booking.date);
    const price = typeof booking.price === 'number' ? booking.price : 0;
    const serviceName = booking.serviceName || 'Service';

    if (booking.status !== 'cancelled') {
      scheduledRevenue += price;
    }

    if (booking.status === 'completed') {
      completedRevenue += price;
    }

    const currentServiceStats = serviceStats.get(serviceName) ?? {
      name: serviceName,
      count: 0,
      revenue: 0,
    };
    currentServiceStats.count += 1;
    if (booking.status !== 'cancelled') {
      currentServiceStats.revenue += price;
    }
    serviceStats.set(serviceName, currentServiceStats);

    if (!bookingDate) {
      continue;
    }

    if (bookingDate >= startOfToday && bookingDate < endOfToday) {
      todayBookings += 1;
    }

    if (bookingDate >= startOfWeek) {
      thisWeekBookings += 1;
    }

    if (bookingDate >= startOfMonth) {
      thisMonthBookings += 1;
    }

    if (bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed') {
      upcomingBookings += 1;
    }
  }

  return {
    totalBookings: bookings.length,
    pendingBookings: statusCounts.pending,
    confirmedBookings: statusCounts.confirmed,
    cancelledBookings: statusCounts.cancelled,
    completedBookings: statusCounts.completed,
    todayBookings,
    thisWeekBookings,
    thisMonthBookings,
    upcomingBookings,
    scheduledRevenue,
    completedRevenue,
    topServices: [...serviceStats.values()]
      .sort((left, right) => right.count - left.count || right.revenue - left.revenue)
      .slice(0, 5),
  };
}
