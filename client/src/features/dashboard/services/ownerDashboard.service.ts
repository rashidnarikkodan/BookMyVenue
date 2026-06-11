import { apiClient } from "@/services/apiClient";
import type { RevenueChartProps } from "../types/ownerDashbord.types";

export interface OwnerDashboardData {
  revenueChartData: RevenueChartProps
}

export async function getDashboardData(): Promise<OwnerDashboardData> {
  const res = await apiClient.get('/owner/dashbord');
  return res.data.data;
}
