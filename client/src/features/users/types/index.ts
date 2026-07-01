export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  owner?: any;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  password?: string;
  image?: File | null;
}

export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'owner' | 'user';
  password?: string;
  image?: File | null;
}

export interface UserQuery {
  search?: string;
  sort?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'all';
  role?: 'all' | 'admin' | 'owner' | 'user';
  page?: number;
  limit?: number;
}

export interface OwnerVerificationResponse {
  id: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt: string | null;
  rejectionReason: string | null;

  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export type PaymentMethod = 'online' | 'cash';

export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';

export type PaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'failed' | 'refunded';
export interface MyBookingsResponse {
  bookings: Booking[];
  totalBookings: number;
}

export interface Booking {
  id: string;

  venue: {
    id: string;
    name: string;
    imageUrl: string | null;
    location: string;
  };

  startDateTime: string;
  endDateTime: string;

  guests: number;

  contactName: string;
  contactEmail: string;
  contactPhone: string;

  specialRequests: string;

  paymentMethod: PaymentMethod;

  bookingStatus: BookingStatus;

  paymentStatus: PaymentStatus;

  totalAmount: number;
  amountPaid: number;

  cancellationReason: string;

  createdAt: string;
  updatedAt: string;
}
