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

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 5,
      ticks: { stepSize: 1, color: "#6B7280" },
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
      position: "top",
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

  useEffect(() => {
    if (!statistics && !isLoading) fetchStatistics();
  }, [statistics, isLoading, fetchStatistics]);

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

    const ratingCounts = [0, 0, 0, 0, 0];
    statistics.feedbacks.forEach((f) => {
      const rounded = Math.round(f.rating);
      if (rounded >= 1 && rounded <= 5) ratingCounts[5 - rounded]++;
    });

    const barLabels = statistics.feedbacks.map(
      (f, i) =>
        `Interview ${i + 1} - ${new Date(f.interviewDate).toLocaleDateString()}`
    );

    return {
      radarData: radarLabels.length > 0 && {
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
      },
      doughnutData: ratingCounts.some((count) => count > 0) && {
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
      },
      barData: statistics.feedbacks.length > 0 && {
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
      },
    };
  }, [statistics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A66C2]"></div>
        <span className="ml-4 text-gray-700">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <X className="mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Candidate Performance
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Comprehensive analysis of your interview journey
        </p>
      </motion.div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm md:text-base font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-[#0A66C2] text-[#0A66C2]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <StatCard
              title="Completed Interviews"
              value={statistics?.completedInterviews}
              icon={<Briefcase size={24} className="text-[#0A66C2]" />}
            />
            <StatCard
              title="Average Rating"
              value={statistics?.averageRating.toFixed(1)}
              icon={<Star size={24} className="text-[#0A66C2]" />}
              customContent={renderStars(statistics?.averageRating || 0)}
            />
            <StatCard
              title="Total Feedbacks"
              value={statistics?.totalFeedbackCount}
              icon={<ClipboardList size={24} className="text-[#0A66C2]" />}
            />
          </motion.div>
        )}

        {activeTab === "feedbacks" && (
          <motion.div
            key="feedbacks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {statistics?.feedbacks.length === 0 ? (
              <EmptyState message="No feedbacks available yet" />
            ) : (
              statistics?.feedbacks.map((feedback) => (
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
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1  gap-6"
          >
            <ChartCard title="Skill Ratings">
              <div className="h-[320px]">
                <Radar data={chartData?.radarData} options={radarOptions} />
              </div>
            </ChartCard>
            <ChartCard title="Rating Distribution">
              <div className="h-[320px]">
                <Doughnut
                  data={chartData?.doughnutData}
                  options={doughnutOptions}
                />
              </div>
            </ChartCard>
            <ChartCard title="Overall Ratings">
              <div className="h-[320px]">
                <Bar data={chartData?.barData} options={barOptions} />
              </div>
            </ChartCard>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFeedback && (
          <FeedbackModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  customContent?: React.ReactNode;
}> = ({ title, value, icon, customContent }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-lg bg-blue-50">{icon}</div>
      <div>
        <h3 className="text-sm md:text-base font-medium text-gray-500">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl font-bold text-[#0A66C2]">{value}</p>
        {customContent && <div className="mt-2">{customContent}</div>}
      </div>
    </div>
  </motion.div>
);

const FeedbackCard: React.FC<{ feedback: Feedback; onClick: () => void }> = ({
  feedback,
  onClick,
}) => (
  <motion.div
    className="bg-white p-4 rounded-lg shadow-sm cursor-pointer   border border-gray-100"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      {feedback?.interviewer?.profilePhoto ? (
        <img
          src={feedback.interviewer.profilePhoto}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
          loading="lazy"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
          {feedback?.interviewer?.firstName[0]}
          {feedback?.interviewer?.lastName[0]}
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-md md:text-lg font-medium text-gray-800">
          {feedback?.interviewer?.firstName} {feedback?.interviewer?.lastName}
        </h4>
        <p className="text-sm text-gray-500">
          {new Date(feedback.interviewDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Star size={20} fill="#FFD700" stroke="#FFD700" />
        <span className="text-gray-700 text-base">
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
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-6">
      {title}
    </h3>
    {children}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
    <p className="text-gray-500 text-sm md:text-base">{message}</p>
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
      className="bg-white p-6 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Feedback Details
      </h3>
      <div className="space-y-6">
        {Object.entries(feedback.feedbackData).map(([key, value], index) => (
          <div key={index} className="space-y-4">
            <h4 className="text-base md:text-lg font-medium text-gray-700 capitalize">
              {key}
            </h4>
            <div className="flex items-center space-x-3">
              <Star size={24} fill="#FFD700" stroke="#FFD700" />
              <span className="text-gray-600 text-base">{value.rating}/5</span>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {value.comments || "No comments provided."}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default CandidateStatistics;
