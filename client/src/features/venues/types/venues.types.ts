export interface Venue {
  _id: string;
  ownerId: string;
  categoryId: string;
  name: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  location: {
    type: 'Point';
    coordinates: number[];
  };
  capacity: number;
  pricing: {
    amount: number;
    unit: 'hour' | 'day';
  };
  amenities: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt: string | null;
  rejectionReason: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
