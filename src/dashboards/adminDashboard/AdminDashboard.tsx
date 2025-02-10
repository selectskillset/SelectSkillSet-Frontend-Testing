import { useEffect, useState } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import DashboardTables from "./DashboardTables";
import { User2Icon } from "lucide-react";
import { AdminDashboardSkeleton } from "../../components/ui/AdminDashboardSkeleton";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/admin/getAll-details");
        const { data: responseData } = response;
        if (responseData.message === "Details fetched successfully") {
          setData(responseData);
        } else {
          throw new Error("Failed to load data");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching data"
        );
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <AdminDashboardSkeleton />;
  }

  const {
    totalCandidates = 0,
    totalInterviewers = 0,
    totalCorporates = 0,
    pendingCount = 0,
    completedCount = 0,
    cancelledCount = 0,
    candidates = [],
    interviewers = [],
    corporates = [],
  } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Add Admin Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/admin/dashboard/profiles")}
            className="bg-[#0073b1] text-white py-2 px-4 mb-5 rounded-lg flex gap-2 items-center"
          >
            Add Admin <User2Icon size={16} />
          </button>
        </div>
        <DashboardStats
          totalCandidates={totalCandidates}
          totalInterviewers={totalInterviewers}
          totalCorporates={totalCorporates}
          pendingCount={pendingCount}
        />
        <DashboardCharts
          pendingCount={pendingCount}
          completedCount={completedCount}
          cancelledCount={cancelledCount}
          totalCandidates={totalCandidates}
          totalInterviewers={totalInterviewers}
          totalCorporates={totalCorporates}
        />
        {/* Tables Section */}
        <DashboardTables
          candidates={candidates}
          interviewers={interviewers}
          corporates={corporates}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
