import Venue from '@/models/venue.model';

export async function getApprovedVenues(ownerId: string) {
  const approvedVenues = await Venue.countDocuments({
    ownerId,
    verificationStatus: 'approved',
  });

  return approvedVenues;
}
