export interface Addon {
  id: string;
  name: string;
  price: number;
  priceType: 'fixed' | 'perHead' | 'perHour';
  description?: string;
  quantity?: number;
}

export interface BookingDetails {
  venueId: string;
  startDateTime: string | null;
  endDateTime: string | null;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
  paymentMethod: 'razorpay' | 'wallet' | 'cash';
  guestList?: any[];
  guestFileName?: string;
}
