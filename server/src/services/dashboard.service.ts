import { getApprovedVenues } from '@/repositories/dashboard.repository';
import type { OwnerDashboard } from '@/types/dashbboard.types';

// OWNER DASHBOARD SERVICE
export async function ownerDashboardService(ownerId: string): Promise<OwnerDashboard> {
  const approvedVenues = await getApprovedVenues(ownerId);

  return {
    statCardData: [
      {
        title: 'Approved Venues',
        value: approvedVenues,
      },
    ],

    revenueChartData: [],
    revenueDistributionData: [],
    upcomingBookings: [],
  };
}
