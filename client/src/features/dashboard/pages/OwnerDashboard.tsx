import { useEffect } from "react";
import RevenueOverView from "../components/owner/RevenueOverview";
import { useAsyncFetch } from "@/shared/hooks/useAsyncFetch";
import { getDashboardData, type OwnerDashboardData } from "../services/ownerDashboard.service";
import DashboardSkelton from "../components/owner/loaders/DashboardSkelton";
import UpcomingBookings from "../components/owner/Upcoming";

export default function OwnerDashboard() {
  const { data, loading, execute } = useAsyncFetch<OwnerDashboardData>();

  useEffect(() => {
    execute(getDashboardData);
  }, [execute]);

  useEffect(() => {
    console.log(data)
  }, []);

  if (loading) {
    return (<DashboardSkelton />)
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-7 col-span-1">
        <RevenueOverView />
      </div>
      <div className="lg:col-span-3 col-span-1">
        <UpcomingBookings />
      </div>
    </div>
  );
}
