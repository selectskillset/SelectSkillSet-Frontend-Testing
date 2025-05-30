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
  Filler,
} from "chart.js";
import { Briefcase, ClipboardList, Star, X } from "lucide-react";
import { useCandidate } from "../../context/CandidateContext";
import { motion, AnimatePresence } from "framer-motion";

// Register ChartJS components
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
  ArcElement,
  Filler
);

// Color constants
const COLORS = {
  primary: "#4338CA",
  primaryLight: "#6366F1",
  primaryDark: "#3730A3",
  secondary: "#7C3AED",
  secondaryLight: "#A78BFA",
  secondaryDark: "#5B21B6",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  star: "#FFD700",
};

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

const CandidateStatistics: React.FC = () => {
  const { statistics, isLoading, fetchStatistics, error } = useCandidate();
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

  // Chart options and data
  const { radarOptions, doughnutOptions, barOptions, chartData } =
    useMemo(() => {
      // Common chart options configuration
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLORS.gray900,
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              labelColor: () => ({
                borderColor: COLORS.primaryLight,
                backgroundColor: COLORS.primaryLight,
                borderWidth: 2,
              }),
            },
          },
        },
      };

      const radarOptions = {
        ...baseOptions,
        scales: {
          r: {
            angleLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1,
              color: COLORS.gray500,
              backdropColor: "transparent",
              font: { weight: "bold" },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.03)",
              circular: true,
            },
            pointLabels: {
              color: COLORS.gray700,
              font: { size: 12, weight: "500" },
              padding: 16,
            },
          },
        },
        elements: {
          line: {
            tension: 0.2,
            borderWidth: 3,
            fill: true,
          },
          point: {
            radius: 4,
            hoverRadius: 6,
            hoverBorderWidth: 2,
          },
        },
      };

      const doughnutOptions = {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            position: "right",
            labels: {
              font: { size: 12, weight: "500" },
              color: COLORS.gray700,
              padding: 16,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
        cutout: "75%",
        radius: "90%",
      };

      const barOptions = {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.03)",
              drawTicks: false,
            },
            ticks: {
              font: { size: 12 },
              color: COLORS.gray500,
              padding: 8,
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12, weight: "500" },
              color: COLORS.gray700,
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 6,
            borderSkipped: "bottom",
          },
        },
      };

      // Prepare chart data
      let radarData = {
        labels: [] as string[],
        datasets: [
          {
            label: "Skill Ratings",
            data: [] as number[],
            backgroundColor: `rgba(99, 102, 241, 0.2)`,
            borderColor: COLORS.primary,
            pointBackgroundColor: COLORS.primary,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: COLORS.primary,
            borderWidth: 3,
            fill: true,
          },
        ],
      };

      let doughnutData = {
        labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
        datasets: [
          {
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              COLORS.primary,
              COLORS.secondary,
              COLORS.primaryLight,
              COLORS.secondaryLight,
              COLORS.gray300,
            ],
            borderWidth: 0,
            hoverBorderWidth: 1,
            hoverBorderColor: "#fff",
          },
        ],
      };

      let barData = {
        labels: [] as string[],
        datasets: [
          {
            label: "Ratings",
            data: [] as number[],
            backgroundColor: COLORS.primary,
            hoverBackgroundColor: COLORS.secondary,
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: "bottom",
          },
        ],
      };

      if (statistics?.feedbacks?.length) {
        // Radar chart data
        const radarLabels = Array.from(
          new Set(
            statistics.feedbacks.flatMap((f) => Object.keys(f.feedbackData))
          )
        );
        const radarValues = radarLabels.map((label) => {
          const values = statistics.feedbacks
            .map((f) => f.feedbackData[label]?.rating)
            .filter((v): v is number => v !== undefined);
          return values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;
        });

        radarData = {
          labels: radarLabels,
          datasets: [
            {
              ...radarData.datasets[0],
              data: radarValues,
            },
          ],
        };

        // Doughnut chart data
        const ratingCounts = [0, 0, 0, 0, 0];
        statistics.feedbacks.forEach((f) => {
          const rounded = Math.round(f.rating);
          if (rounded >= 1 && rounded <= 5) ratingCounts[5 - rounded]++;
        });

        doughnutData = {
          ...doughnutData,
          datasets: [
            {
              ...doughnutData.datasets[0],
              data: ratingCounts,
            },
          ],
        };

        // Bar chart data
        barData = {
          labels: statistics.feedbacks.map(
            (f, i) =>
              `#${i + 1} - ${new Date(f.interviewDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}`
          ),
          datasets: [
            {
              ...barData.datasets[0],
              data: statistics.feedbacks.map((f) => f.rating),
            },
          ],
        };
      }

      return {
        radarOptions,
        doughnutOptions,
        barOptions,
        chartData: { radarData, doughnutData, barData },
      };
    }, [statistics]);

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
                ? COLORS.star
                : "none"
            }
            stroke={COLORS.star}
            strokeWidth={i >= fullStars && !hasHalfStar ? 1 : 0}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Interview Performance
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Comprehensive analysis of your interview results
        </p>
      </motion.div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4 md:space-x-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 text-sm md:text-base font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
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
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            <StatCard
              title="Completed Interviews"
              value={statistics?.completedInterviews || 0}
              icon={<Briefcase size={20} className="text-primary" />}
            />
            <StatCard
              title="Average Rating"
              value={statistics?.averageRating?.toFixed(1) || "0.0"}
              icon={<Star size={20} className="text-primary" />}
              customContent={renderStars(statistics?.averageRating || 0)}
            />
            <StatCard
              title="Total Feedbacks"
              value={statistics?.totalFeedbackCount || 0}
              icon={<ClipboardList size={20} className="text-primary" />}
            />
          </motion.div>
        )}

        {activeTab === "feedbacks" && (
          <motion.div
            key="feedbacks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {!statistics?.feedbacks?.length ? (
              <EmptyState message="No feedbacks available yet" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {!statistics?.feedbacks?.length ? (
              <EmptyState message="No analysis data available yet" />
            ) : (
              <>
                <div className="lg:col-span-2">
                  <ChartCard title="Skill Ratings">
                    <div className="h-80 md:h-96 relative">
                      <Radar
                        data={chartData.radarData}
                        options={radarOptions}
                      />
                    </div>
                  </ChartCard>
                </div>

                <ChartCard title="Rating Distribution">
                  <div className="h-64 md:h-80 relative">
                    <Doughnut
                      data={chartData.doughnutData}
                      options={doughnutOptions}
                    />
                  </div>
                </ChartCard>

                <ChartCard title="Interview Ratings">
                  <div className="h-64 md:h-80 relative">
                    <Bar data={chartData.barData} options={barOptions} />
                  </div>
                </ChartCard>
              </>
            )}
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

// Component implementations
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  customContent?: React.ReactNode;
}> = ({ title, value, icon, customContent }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
  >
    <div className="flex items-start space-x-3">
      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="text-2xl font-bold text-primary mt-1">{value}</p>
        {customContent && <div className="mt-2">{customContent}</div>}
      </div>
    </div>
  </motion.div>
);

const FeedbackCard: React.FC<{ feedback: Feedback; onClick: () => void }> = ({
  feedback,
  onClick,
}) => {
  const formattedDate = useMemo(() => {
    return new Date(feedback.interviewDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [feedback.interviewDate]);

  // Get the first 3 skill categories for the card preview
  const previewSkills = useMemo(() => {
    const skills = Object.entries(feedback.feedbackData);
    return skills.slice(0, 3);
  }, [feedback.feedbackData]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-xl shadow-sm cursor-pointer border border-gray-100 hover:shadow-md transition-all h-full flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        {feedback.interviewer.profilePhoto ? (
          <img
            src={feedback.interviewer.profilePhoto}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium border-2 border-white shadow-sm">
            {feedback.interviewer.firstName[0]}
            {feedback.interviewer.lastName[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-800 truncate">
            {feedback.interviewer.firstName} {feedback.interviewer.lastName}
          </h4>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-md mb-3 w-fit">
        <Star size={16} fill={COLORS.star} stroke={COLORS.star} />
        <span className="text-sm font-medium text-gray-700">
          {feedback.rating.toFixed(1)}
        </span>
      </div>

      <div className="space-y-2 flex-1">
        {previewSkills.map(([key, value], index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500 truncate capitalize">
              {key}
            </span>
            <span className="text-xs font-bold text-primary">
              {value.rating}/5
            </span>
          </div>
        ))}
        {Object.keys(feedback.feedbackData).length > 3 && (
          <div className="text-xs text-gray-400 mt-1">
            +{Object.keys(feedback.feedbackData).length - 3} more skills
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="text-xs font-medium text-primary hover:text-primaryDark transition">
          View Full Feedback
        </button>
      </div>
    </motion.div>
  );
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center col-span-full"
  >
    <p className="text-gray-500 text-sm md:text-base">{message}</p>
  </motion.div>
);

const FeedbackModal: React.FC<{ feedback: Feedback; onClose: () => void }> = ({
  feedback,
  onClose,
}) => {
  const skillCategories = useMemo(() => {
    return Object.entries(feedback.feedbackData).sort(([a], [b]) => {
      // Put "Final Recommendation" at the bottom
      if (a === "Final Recommendation") return 1;
      if (b === "Final Recommendation") return -1;
      return a.localeCompare(b);
    });
  }, [feedback.feedbackData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white p-5 md:p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          {feedback.interviewer.profilePhoto ? (
            <img
              src={feedback.interviewer.profilePhoto}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium border-2 border-white shadow-sm">
              {feedback.interviewer.firstName[0]}
              {feedback.interviewer.lastName[0]}
            </div>
          )}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Feedback Details
            </h3>
            <p className="text-sm text-gray-500">
              Interview on{" "}
              {new Date(feedback.interviewDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {skillCategories.map(([key, value], index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-base md:text-lg font-medium text-gray-800 capitalize">
                  {key}
                </h4>
                <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-md">
                  <Star size={16} fill={COLORS.star} stroke={COLORS.star} />
                  <span className="text-sm font-medium text-gray-700">
                    {value.rating}/5
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base bg-gray-50 p-3 rounded-lg">
                {value.comments || "No comments provided."}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CandidateStatistics;
