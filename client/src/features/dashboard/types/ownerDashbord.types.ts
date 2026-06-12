import type React from "react";

export type RevenueChartProps = {
  data: {
    period: string;
    revenue: number;
    bookings: number;
  }[];
}

export type FilterType = 'weekly' | 'monthly' | 'yearly';

export type RevenueTitleProps = {
  filter: 'weekly' | 'monthly' | 'yearly';
  setFilter: React.Dispatch<React.SetStateAction<'weekly' | 'monthly' | 'yearly'>>
}

export type RevenueDistributionProps = {
  data: {
    category: string;
    revenue: number;
  }[];
}
