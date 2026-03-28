export type UserRole = 'client' | 'staff' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  displayName?: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Barbering' | 'Hair Salon' | 'Spa';
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  userId: string;
  name?: string;
  userEmail?: string;
  userName?: string;
  serviceId: string;
  service?: string;
  serviceName?: string;
  price?: number;
  staffId?: string;
  date: string;
  time?: string;
  status: BookingStatus;
  notes?: string;
  createdAt?: string;
}

export interface Staff {
  uid: string;
  name: string;
  specialization: string;
  bio: string;
  photoURL?: string;
}
