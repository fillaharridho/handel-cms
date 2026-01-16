import { getDashboardData } from '../../../services/dashboardService';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
  // Ambil data langsung di Server
  const data = await getDashboardData();

  return (
    <DashboardClient 
      initialCounts={data.counts} 
      initialComplaints={data.recentComplaints} 
    />
  );
}