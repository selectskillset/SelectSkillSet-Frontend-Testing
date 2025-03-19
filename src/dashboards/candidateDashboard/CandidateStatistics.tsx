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
import {
  Briefcase,
  ClipboardList,
  Star,
  X,
  AlertCircle, // Added missing import
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCandidateContext } from "../../context/CandidateContext";

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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { size: 14 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      padding: 12,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 5,
      ticks: { stepSize: 1, color: "#64748b" },
      grid: { color: "#e2e8f0" },
      pointLabels: { color: "#0f172a", font: { size: 14 } },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      grid: { color: "#e2e8f0" },
      ticks: { color: "#64748b" },
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
            size={20}
            className={
              i < fullStars || (i === fullStars && hasHalfStar)
                ? "text-amber-400"
                : "text-slate-300"
            }
            fill={
              i < fullStars || (i === fullStars && hasHalfStar)
                ? "currentColor"
                : "none"
            }
          />
        ))}
      </div>
    );
  }, []);

  const chartData = useMemo(() => {
    if (!statistics) return null;

    const radarLabels = Array.from(
      new Set(statistics.feedbacks.flatMap((f) => Object.keys(f.feedbackData)))
    );

    const radarValues = radarLabels.map((label) => {
      const ratings = statistics.feedbacks
        .map((f) => f.feedbackData[label]?.rating)
        .filter(Boolean) as number[];
      return ratings.length
        ? ratings.reduce((a, b) => a + b) / ratings.length
        : 0;
    });

    const ratingCounts = [0, 0, 0, 0, 0];
    statistics.feedbacks.forEach((f) => {
      const rounded = Math.round(f.rating);
      if (rounded >= 1 && rounded <= 5) ratingCounts[5 - rounded]++;
    });

    return {
      radarData: radarLabels.length > 0 && {
        labels: radarLabels,
        datasets: [
          {
            label: "Skill Ratings",
            data: radarValues,
            backgroundColor: "rgba(14, 165, 233, 0.2)",
            borderColor: "#0ea5e9",
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
              "#0ea5e9",
              "#38bdf8",
              "#7dd3fc",
              "#bae6fd",
              "#e0f2fe",
            ],
          },
        ],
      },
      barData: statistics.feedbacks.length > 0 && {
        labels: statistics.feedbacks.map(
          (f, i) =>
            `Interview ${i + 1} - ${new Date(
              f.interviewDate
            ).toLocaleDateString()}`
        ),
        datasets: [
          {
            label: "Ratings",
            data: statistics.feedbacks.map((f) => f.rating),
            backgroundColor: "#0ea5e9",
            borderRadius: 8,
          },
        ],
      },
    };
  }, [statistics]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!statistics) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      {/* Header */}
      <header className="mb-8">
        <motion.h1
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-2xl font-semibold text-slate-900"
        >
          Performance Insights
        </motion.h1>
        <p className="text-slate-600 mt-1">
          Comprehensive analysis of your interview performance
        </p>
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-slate-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 pb-3 font-medium transition-colors relative
              ${
                activeTab === tab.id
                  ? "text-sky-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Completed Interviews"
                value={statistics.completedInterviews}
                icon={<Briefcase className="text-sky-600" />}
              />
              <StatCard
                title="Average Rating"
                value={statistics.averageRating.toFixed(1)}
                icon={<Star className="text-sky-600" />}
                customContent={renderStars(statistics.averageRating)}
              />
              <StatCard
                title="Total Feedbacks"
                value={statistics.totalFeedbackCount}
                icon={<ClipboardList className="text-sky-600" />}
              />
            </div>
          )}

          {activeTab === "feedbacks" && (
            <div className="space-y-4">
              {statistics.feedbacks.length ? (
                statistics.feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                  />
                ))
              ) : (
                <EmptyState message="No feedback received yet" />
              )}
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartData?.radarData && (
                <ChartCard title="Skill Competencies">
                  <div className="h-80">
                    <Radar data={chartData.radarData} options={chartOptions} />
                  </div>
                </ChartCard>
              )}
              {chartData?.doughnutData && (
                <ChartCard title="Rating Distribution">
                  <div className="h-80">
                    <Doughnut
                      data={chartData.doughnutData}
                      options={chartOptions}
                    />
                  </div>
                </ChartCard>
              )}
              {chartData?.barData && (
                <ChartCard title="Interview Ratings Timeline">
                  <div className="h-80">
                    <Bar
                      data={chartData.barData}
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          x: { display: false },
                        },
                      }}
                    />
                  </div>
                </ChartCard>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <FeedbackModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Reusable components
const StatCard = React.memo(
  ({
    title,
    value,
    icon,
    customContent,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    customContent?: React.ReactNode;
  }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-sky-50 rounded-lg text-sky-600">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
          {customContent}
        </div>
      </div>
    </motion.div>
  )
);

const FeedbackCard = React.memo(
  ({ feedback, onClick }: { feedback: Feedback; onClick: () => void }) => (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="bg-white p-4 rounded-lg border border-slate-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {feedback.interviewer.profilePhoto ? (
            <img
              src={feedback.interviewer.profilePhoto}
              alt="Interviewer"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              {feedback.interviewer.firstName[0]}
              {feedback.interviewer.lastName[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-900">
            {feedback.interviewer.firstName} {feedback.interviewer.lastName}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {new Date(feedback.interviewDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <Star size={18} fill="currentColor" />
          <span className="font-medium">{feedback.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  )
);

const ChartCard = React.memo(
  ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  )
);

const FeedbackModal = React.memo(
  ({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Detailed Feedback
            </h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            {Object.entries(feedback.feedbackData).map(([category, data]) => (
              <div
                key={category}
                className="border-b border-slate-200 pb-6 last:border-0"
              >
                <h4 className="font-medium text-slate-900 capitalize mb-3">
                  {category}
                </h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={18} fill="currentColor" />
                    <span className="font-medium">{data.rating}/5</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {data.comments || "No additional comments provided."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
);

const LoadingState = React.memo(() => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse space-y-6 w-full max-w-2xl">
      <div className="h-8 bg-slate-200 rounded-full w-1/2 mx-auto" />
      <div className="h-4 bg-slate-200 rounded-full w-1/3 mx-auto" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
));

const ErrorState = React.memo(({ error }: { error: string }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center text-red-600 space-y-4">
    <AlertCircle size={40} className="text-red-500" />
    <p className="text-lg font-medium">{error}</p>
  </div>
));

const EmptyState = React.memo(({ message }: { message: string }) => (
  <div className="min-h-[200px] flex items-center justify-center text-slate-500">
    {message}
  </div>
));

export default CandidateStatistics;
