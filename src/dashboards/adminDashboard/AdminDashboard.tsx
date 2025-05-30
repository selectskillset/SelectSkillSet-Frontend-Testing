import { useAdminContext } from "../../context/AdminContext";
import { AdminDashboardSkeleton } from "../../components/ui/AdminDashboardSkeleton";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";

const AdminDashboard = () => {
  const { data, loading } = useAdminContext();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500">No data available</div>
        </div>
      </div>
    );
  }

  const {
    totalCandidates = 0,
    totalInterviewers = 0,
    totalCorporates = 0,
    pendingCount = 0,
    completedCount = 0,
    cancelledCount = 0,
  } = data;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Stats */}
        <DashboardStats
          totalCandidates={totalCandidates}
          totalInterviewers={totalInterviewers}
          totalCorporates={totalCorporates}
          pendingCount={pendingCount}
        />

        {/* Charts Section */}
        <DashboardCharts
          totalCandidates={totalCandidates}
          totalInterviewers={totalInterviewers}
          totalCorporates={totalCorporates}
          pendingCount={pendingCount}
          completedCount={completedCount}
          cancelledCount={cancelledCount}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
