// src/components/CandidateStatistics.tsx
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Bar, Radar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Briefcase, ClipboardList, Star, X } from "lucide-react";
import { useCandidateContext } from "../../context/CandidateContext";
import { motion, AnimatePresence } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement
);

// Type definitions
interface Feedback {
  interviewRequestId: string;
  feedbackData: Record<string, { rating: number; comments: string }>;
  rating: number;
  _id: string;
  interviewDate: string;
  interviewer: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

interface Statistics {
  completedInterviews: number;
  averageRating: number;
  totalFeedbackCount: number;
  feedbacks: Feedback[];
}

// Chart options with improved formatting
const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1,
        color: "#6B7280",
        backdropColor: "transparent",
        font: { size: 12 },
      },
      grid: { color: "#E5E7EB" },
      pointLabels: { color: "#374151", font: { size: 12 } },
    },
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Skill Ratings",
      font: { size: 16, weight: "bold" },
      color: "#1F2937",
    },
    tooltip: {
      backgroundColor: "#1F2937",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
  elements: { line: { tension: 0.3 } },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { font: { size: 12 }, color: "#374151" },
    },
    title: {
      display: true,
      text: "Rating Distribution",
      font: { size: 16, weight: "bold" },
      color: "#1F2937",
    },
    tooltip: {
      backgroundColor: "#1F2937",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Overall Ratings",
      font: { size: 16, weight: "bold" },
      color: "#1F2937",
    },
    tooltip: {
      backgroundColor: "#1F2937",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#E5E7EB" },
      ticks: { font: { size: 12 }, color: "#6B7280" },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 12 }, color: "#374151" },
    },
  },
};

const CandidateStatistics: React.FC = () => {
  const { statistics, isLoading, fetchStatistics, error } =
    useCandidateContext();

  useEffect(() => {
    if (!statistics && !isLoading) {
      fetchStatistics();
    }
  }, [statistics, isLoading, fetchStatistics]);

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "feedbacks", label: "Feedbacks" },
      { id: "analysis", label: "Analysis" },
    ],
    []
  );

  const renderStars = useCallback((rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={
              i < fullStars || (i === fullStars && hasHalfStar)
                ? "#FFD700"
                : "none"
            }
            stroke="#FFD700"
            strokeWidth={i >= fullStars && !hasHalfStar ? 1 : 0}
          />
        ))}
      </div>
    );
  }, []);

  const chartData = useMemo(() => {
    if (!statistics)
      return { radarData: null, doughnutData: null, barData: null };

    // Radar Chart Data
    const radarLabels = Array.from(
      new Set(statistics.feedbacks.flatMap((f) => Object.keys(f.feedbackData)))
    );
    const radarValues = radarLabels.map((label) => {
      const values = statistics.feedbacks
        .map((f) => f.feedbackData[label]?.rating)
        .filter((v): v is number => v !== undefined);
      return values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;
    });

    // Doughnut Chart Data
    const ratingCounts = [0, 0, 0, 0, 0];
    statistics.feedbacks.forEach((f) => {
      const rounded = Math.round(f.rating);
      if (rounded >= 1 && rounded <= 5) ratingCounts[5 - rounded]++;
    });

    // Bar Chart Data
    const barLabels = statistics.feedbacks.map(
      (f, i) =>
        `Interview ${i + 1} - ${new Date(f.interviewDate).toLocaleDateString()}`
    );

    return {
      radarData:
        radarLabels.length > 0
          ? {
              labels: radarLabels,
              datasets: [
                {
                  label: "Skill Ratings",
                  data: radarValues,
                  backgroundColor: "rgba(10, 102, 194, 0.2)",
                  borderColor: "#0A66C2",
                  pointBackgroundColor: "#0A66C2",
                  pointBorderColor: "#fff",
                  borderWidth: 2,
                },
              ],
            }
          : null,
      doughnutData: ratingCounts.some((count) => count > 0)
        ? {
            labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
            datasets: [
              {
                data: ratingCounts,
                backgroundColor: [
                  "#0A66C2",
                  "#4CAF50",
                  "#FFC107",
                  "#FF5722",
                  "#9E9E9E",
                ],
                borderWidth: 1,
                borderColor: "#fff",
              },
            ],
          }
        : null,
      barData:
        statistics.feedbacks.length > 0
          ? {
              labels: barLabels,
              datasets: [
                {
                  label: "Ratings",
                  data: statistics.feedbacks.map((f) => f.rating),
                  backgroundColor: "#0A66C2",
                  borderRadius: 8,
                  barThickness: 20,
                },
              ],
            }
          : null,
    };
  }, [statistics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse text-lg text-gray-500">
          Loading statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500">
        {error}
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className="min-h-screen bg-white shadow-lg rounded-xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto  p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Candidate Performance
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed analytics of your interview results
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "text-[#0A66C2] border-b-2 border-[#0A66C2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              <StatCard
                title="Completed Interviews"
                value={statistics.completedInterviews}
                icon={<Briefcase size={20} className="text-[#0A66C2]" />}
              />
              <StatCard
                title="Average Rating"
                value={statistics.averageRating.toFixed(1)}
                icon={<Star size={20} className="text-[#0A66C2]" />}
                customContent={renderStars(statistics.averageRating)}
              />
              <StatCard
                title="Total Feedbacks"
                value={statistics.totalFeedbackCount}
                icon={<ClipboardList size={20} className="text-[#0A66C2]" />}
              />
            </motion.div>
          )}

          {activeTab === "feedbacks" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {statistics.feedbacks.length === 0 ? (
                <EmptyState message="No feedbacks available yet" />
              ) : (
                statistics.feedbacks.map((feedback, i) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "analysis" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {chartData.radarData ? (
                <ChartCard title="Skill Ratings">
                  <div className="h-64 sm:h-72 md:h-80">
                    <Radar data={chartData.radarData} options={radarOptions} />
                  </div>
                </ChartCard>
              ) : (
                <EmptyState message="No skill data available for analysis" />
              )}

              {chartData.doughnutData ? (
                <ChartCard title="Rating Distribution">
                  <div className="h-64 sm:h-72 md:h-80">
                    <Doughnut
                      data={chartData.doughnutData}
                      options={doughnutOptions}
                    />
                  </div>
                </ChartCard>
              ) : (
                <EmptyState message="No rating distribution data available" />
              )}

              {chartData.barData ? (
                <ChartCard title="Overall Ratings">
                  <div className="h-64 sm:h-72 md:h-80">
                    <Bar data={chartData.barData} options={barOptions} />
                  </div>
                </ChartCard>
              ) : (
                <EmptyState message="No ratings data available for visualization" />
              )}
            </motion.div>
          )}
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {selectedFeedback && (
            <FeedbackModal
              feedback={selectedFeedback}
              onClose={() => setSelectedFeedback(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  customContent?: React.ReactNode;
}> = ({ title, value, icon, customContent }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center space-y-2 border border-gray-100 hover:shadow-lg transition-shadow"
  >
    {icon}
    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
    <p className="text-xl font-bold text-[#0A66C2]">{value}</p>
    {customContent && <div>{customContent}</div>}
  </motion.div>
);

const FeedbackCard: React.FC<{ feedback: Feedback; onClick: () => void }> = ({
  feedback,
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      {feedback.interviewer.profilePhoto ? (
        <img
          src={feedback.interviewer.profilePhoto}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
          {feedback.interviewer.firstName[0]}
          {feedback.interviewer.lastName[0]}
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-md font-medium text-gray-800">
          {feedback.interviewer.firstName} {feedback.interviewer.lastName}
        </h4>
        <p className="text-xs text-gray-500">
          {new Date(feedback.interviewDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Star size={16} fill="#FFD700" stroke="#FFD700" />
        <span className="text-gray-700 text-sm">
          {feedback.rating.toFixed(1)}
        </span>
      </div>
    </div>
  </motion.div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
    <h3 className="text-md font-medium text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center text-gray-500 text-sm">
    {message}
  </div>
);

const FeedbackModal: React.FC<{ feedback: Feedback; onClose: () => void }> = ({
  feedback,
  onClose,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-lg border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Feedback Details</h3>
      <div className="space-y-4">
        {Object.entries(feedback.feedbackData).map(([key, value], index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-md font-medium text-gray-700 capitalize">
              {key}
            </h4>
            <div className="flex items-center gap-2">
              <Star size={16} fill="#FFD700" stroke="#FFD700" />
              <span className="text-gray-600 text-sm">{value.rating}/5</span>
            </div>
            <p className="text-gray-600 text-sm">
              {value.comments || "No comments provided."}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default CandidateStatistics;
