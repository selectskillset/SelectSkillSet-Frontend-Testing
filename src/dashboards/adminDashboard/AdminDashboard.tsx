import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import "chart.js/auto";
import axiosInstance from "../../components/common/axiosConfig";
import Loader from "../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { Table, User2Icon } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/admin/getAll-details");
        const { data } = response;

        if (data.message === "Details fetched successfully") {
          setData(data);
          toast.success("Data loaded successfully!");
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
    return <Loader />;
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

  const barChartData = {
    labels: [
      "Total Candidates",
      "Total Interviewers",
      "Total Corporates",
      "Pending",
      "Completed",
      "Cancelled",
    ],
    datasets: [
      {
        label: "Statistics",
        data: [
          totalCandidates,
          totalInterviewers,
          totalCorporates,
          pendingCount,
          completedCount,
          cancelledCount,
        ],
        backgroundColor: [
          "#0073b1",
          "#00a0dc",
          "#FF6B6B",
          "#7fb9e1",
          "#cce4f7",
          "#174774",
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Interview Status",
        data: [pendingCount, completedCount, cancelledCount],
        backgroundColor: ["#0073b1", "#00a0dc", "#7fb9e1"],
      },
    ],
  };

  const renderTableRows = (list, type) =>
    list.length ? (
      list.map((item) => (
        <tr key={item._id} className="hover:bg-gray-100">
          <td className="border border-gray-300 p-3">{`${
            item.firstName || item.contactName
          } ${item.lastName || ""}`}</td>
          <td className="border border-gray-300 p-3">{item.email}</td>
          <td className="border border-gray-300 p-3">
            {type === "corporates" ? item.companyName : item.jobTitle || "N/A"}
          </td>
          <td className="border border-gray-300 p-3">
            {type === "corporates" ? item.location : item.location || "N/A"}
          </td>
          <td className="border border-gray-300 p-3">
            {type === "corporates"
              ? item.industry || "N/A"
              : type === "candidates"
              ? item.scheduledInterviews?.length || "No Interviews"
              : item.interviewRequests?.length || "No Interviews"}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center py-4">
          No data available.
        </td>
      </tr>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-[#0073b1]">
            Admin Dashboard
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard/profiles")}
            className="p-2 bg-[#0073b1] text-white rounded-full"
          >
            <User2Icon />
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Candidates", value: totalCandidates },
            { label: "Total Interviewers", value: totalInterviewers },
            { label: "Total Corporates", value: totalCorporates },
            { label: "Pending Interviews", value: pendingCount },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white shadow-md rounded-lg"
            >
              <h2 className="text-xl font-semibold text-[#0073b1]">
                {stat.label}
              </h2>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {[
            { title: "Interview Statistics", data: barChartData },
            { title: "Interview Status", data: doughnutChartData },
          ].map((chart) => (
            <div
              key={chart.title}
              className="p-6 bg-white shadow-md rounded-lg"
            >
              <h2 className="text-xl font-semibold text-[#0073b1] mb-4">
                {chart.title}
              </h2>
              {chart.title === "Interview Statistics" ? (
                <Bar data={chart.data} />
              ) : (
                <Doughnut data={chart.data} />
              )}
            </div>
          ))}
        </div>

        {/* Tables */}
        {[
          { title: "Candidates List", data: candidates, type: "candidates" },
          {
            title: "Interviewers List",
            data: interviewers,
            type: "interviewers",
          },
          { title: "Corporates List", data: corporates, type: "corporates" },
        ].map((table) => (
          <div
            key={table.title}
            className="mt-8 p-6 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold text-[#0073b1] mb-4 flex items-center gap-2">
              <Table size={24} /> {table.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#0073b1] text-white">
                    <th className="border border-gray-300 p-3 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      {table.type === "corporates"
                        ? "Company Name"
                        : "Job Title"}
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Location
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      {table.type === "corporates" ? "Industry" : "Interviews"}
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTableRows(table.data, table.type)}</tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
