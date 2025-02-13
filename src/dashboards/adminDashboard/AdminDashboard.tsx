// AdminDashboard.tsx
import { useNavigate } from "react-router-dom";
import { User2Icon } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";
import { AdminDashboardSkeleton } from "../../components/ui/AdminDashboardSkeleton";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, loading } = useAdminContext();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-5">
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
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/admin/dashboard/profiles")}
            className="bg-[#0073b1] text-white py-2 px-4 mb-5 rounded-lg flex gap-2 items-center"
          >
            Add Admin <User2Icon size={16} />
          </button>
        </div>

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
