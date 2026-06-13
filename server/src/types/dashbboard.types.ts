export interface ApiResponse<T> {
  data: T;
}

export interface RevenueChartItem {
  period: string;
  revenue: number;
  bookings: number;
}

export interface RevenueDistributionItem {
  category: string;
  revenue: number;
}

export interface StatCardItem {
  title: string;
  value: string | number;
}

export interface UpcomingBooking {
  venue: string;
  user: string;
  capacity: number;
  date: Date;
  time: string;
}

export interface OwnerDashboard {
  revenueChartData: RevenueChartItem[];
  revenueDistributionData: RevenueDistributionItem[];
  statCardData: StatCardItem[];
  upcomingBookings: UpcomingBooking[];
}
