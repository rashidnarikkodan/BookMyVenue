import Venue from '@/models/venue.model';

export async function getApprovedVenues(ownerId: string) {
  return Venue.countDocuments({
    ownerId,
    verificationStatus: 'approved',
  });
}
