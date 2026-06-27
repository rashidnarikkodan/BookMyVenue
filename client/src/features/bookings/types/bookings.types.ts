
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
  addOns: Addon[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
  paymentMethod: 'card' | 'upi' | 'cash';
  paymentDetails?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardHolder?: string;
    upiId?: string;
  };
  guestList?: any[];
  guestFileName?: string;
}
