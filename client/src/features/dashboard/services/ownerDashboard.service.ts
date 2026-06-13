import { apiClient } from '@/services/apiClient';
import type {
  RevenueChartProps,
  RevenueDistributionProps,
  StatCardProps,
  TopPerformingVenuesProps,
  UpcomingBookingProps,
  VenueHealthProps,
} from '../types/ownerDashbord.types';

export interface OwnerDashboardData {
  revenueChartData: RevenueChartProps;
  pieChartData: RevenueDistributionProps;
  statCardData: StatCardProps;
  upcomingData: UpcomingBookingProps;
  venueHealthData: VenueHealthProps;
  topPerformingData: TopPerformingVenuesProps;
}

export async function getDashboardData(): Promise<OwnerDashboardData> {
  const res = await apiClient.get('/owners/dashboard');
  return res.data.data;
}
