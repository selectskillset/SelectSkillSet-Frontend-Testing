import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
Chart.register(...registerables);

interface DashboardChartsProps {
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
  totalCandidates: number;
  totalInterviewers: number;
  totalCorporates: number;
}

const DashboardCharts = ({
  pendingCount,
  completedCount,
  cancelledCount,
  totalCandidates,
  totalInterviewers,
  totalCorporates,
}: DashboardChartsProps) => {
  const colors = {
    blue: "#3B82F6",
    indigo: "#6366F1",
    teal: "#14B8A6",
    rose: "#F43F5E",
    sky: "#0EA5E9",
    slate: "#64748B",
  };

  // User Distribution Chart Data
  const userDistributionData = {
    labels: ["Candidates", "Interviewers", "Corporates"],
    datasets: [
      {
        label: "User Count",
        data: [totalCandidates, totalInterviewers, totalCorporates],
        backgroundColor: [
          `rgba(59, 130, 246, 0.8)`,
          `rgba(99, 102, 241, 0.8)`,
          `rgba(20, 184, 166, 0.8)`,
        ],
        borderColor: [colors.blue, colors.indigo, colors.teal],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Interview Status Chart Data
  const interviewStatusData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Interviews",
        data: [pendingCount, completedCount, cancelledCount],
        backgroundColor: [
          `rgba(244, 63, 94, 0.8)`,
          `rgba(20, 184, 166, 0.8)`,
          `rgba(59, 130, 246, 0.8)`,
        ],
        borderColor: "#fff",
        borderWidth: 3,
        cutout: "75%",
        spacing: 8,
      },
    ],
  };

  // Common chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
          usePointStyle: true,
          pointStyle: "circle",
          color: colors.slate,
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  // Bar chart specific options
  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          stepSize: 1,
          color: colors.slate,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.slate,
        },
      },
    },
  };

  // Doughnut chart specific options
  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "right",
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* User Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          User Distribution
        </h3>
        <div className="h-80 relative">
          <Bar data={userDistributionData} options={barOptions} />
        </div>
      </motion.div>

      {/* Interview Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Interview Status
        </h3>
        <div className="h-80 relative">
          <Doughnut data={interviewStatusData} options={doughnutOptions} />
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Total Interviews: {pendingCount + completedCount + cancelledCount}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
