import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import { Bar, Radar, Doughnut } from "react-chartjs-2";
import { Star, X, Briefcase, ClipboardList } from "lucide-react";
import { useInterviewer } from "../../context/InterviewerContext";
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

const InterviewerStatistics = () => {
  const { statistics, fetchStatistics } = useInterviewer();
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  // Fetch data only once when component mounts
  useEffect(() => {
    if (!dataFetchedRef.current) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await fetchStatistics();
          setError(null);
        } catch (err) {
          console.error("Failed to fetch statistics:", err);
          setError("Failed to load statistics. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
      dataFetchedRef.current = true;
    }
  }, [fetchStatistics]);

  const {
    completedInterviews = 0,
    pendingRequests = 0,
    totalAccepted = 0,
    feedbacks = [],
  } = statistics || {};

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "feedbacks", label: "Feedbacks" },
      { id: "ratings", label: "Analysis" },
    ],
    []
  );

  // Prepare all chart data in a single memoized calculation
  const { radarData, doughnutData, barData, chartOptions } = useMemo(() => {
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

    // Radar chart options
    const radarOptions = {
      ...baseOptions,
      scales: {
        r: {
          angleLines: { display: true, color: "rgba(0, 0, 0, 0.05)" },
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            color: COLORS.gray500,
            backdropColor: "transparent",
            font: { weight: "bold" },
          },
          grid: { color: "rgba(0, 0, 0, 0.03)", circular: true },
          pointLabels: {
            color: COLORS.gray700,
            font: { size: 12, weight: "500" },
            padding: 16,
          },
        },
      },
      elements: {
        line: { tension: 0.2, borderWidth: 3, fill: true },
        point: { radius: 4, hoverRadius: 6, hoverBorderWidth: 2 },
      },
    };

    // Doughnut chart options
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

    // Bar chart options
    const barOptions = {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0, 0, 0, 0.03)", drawTicks: false },
          ticks: { font: { size: 12 }, color: COLORS.gray500, padding: 8 },
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
      elements: { bar: { borderRadius: 6, borderSkipped: "bottom" } },
    };

    // Prepare radar chart data
    let radarLabels: string[] = [];
    let radarValues: number[] = [];

    if (feedbacks.length > 0) {
      radarLabels = Array.from(
        new Set(feedbacks.flatMap((f) => Object.keys(f.feedbackData)))
      );

      radarValues = radarLabels.map((label) => {
        const values = feedbacks
          .map((f) => f.feedbackData[label]?.rating)
          .filter((v): v is number => v !== undefined);
        return values.length
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;
      });
    }

    const radarData = {
      labels: radarLabels,
      datasets: [
        {
          label: "Skill Ratings",
          data: radarValues,
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

    // Prepare doughnut chart data
    const ratingCounts = [0, 0, 0, 0, 0];
    feedbacks.forEach((f) => {
      const rounded = Math.round(f.rating);
      if (rounded >= 1 && rounded <= 5) ratingCounts[5 - rounded]++;
    });

    const doughnutData = {
      labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
      datasets: [
        {
          data: ratingCounts,
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

    // Prepare bar chart data
    const barData = {
      labels: ["Completed", "Pending", "Accepted"],
      datasets: [
        {
          label: "Interview Stats",
          data: [completedInterviews, pendingRequests, totalAccepted],
          backgroundColor: [COLORS.primary, COLORS.gray300, COLORS.secondary],
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };

    return {
      radarData,
      doughnutData,
      barData,
      chartOptions: {
        radarOptions,
        doughnutOptions,
        barOptions,
      },
    };
  }, [completedInterviews, pendingRequests, totalAccepted, feedbacks]);

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

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSelectedFeedback(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-4 text-gray-700">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
          <X size={20} />
          <span>{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
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
              onClick={() => handleTabChange(tab.id)}
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
              value={completedInterviews}
              icon={<Briefcase size={20} className="text-primary" />}
            />
            <StatCard
              title="Pending Requests"
              value={pendingRequests}
              icon={<ClipboardList size={20} className="text-primary" />}
            />
            <StatCard
              title="Total Accepted"
              value={totalAccepted}
              icon={<Star size={20} className="text-primary" />}
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
            {feedbacks.length === 0 ? (
              <EmptyState message="No feedbacks available yet" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.interviewRequestId}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "ratings" && (
          <motion.div
            key="ratings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {feedbacks.length === 0 ? (
              <EmptyState message="No analysis data available yet" />
            ) : (
              <>
                <ChartCard title="Skill Ratings">
                  <div className="h-80 md:h-96 relative">
                    <Radar
                      data={radarData}
                      options={chartOptions.radarOptions}
                    />
                  </div>
                </ChartCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Rating Distribution">
                    <div className="h-64 md:h-80 relative">
                      <Doughnut
                        data={doughnutData}
                        options={chartOptions.doughnutOptions}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">
                            {feedbacks.length > 0
                              ? (
                                  feedbacks.reduce(
                                    (sum, f) => sum + f.rating,
                                    0
                                  ) / feedbacks.length
                                ).toFixed(1)
                              : "0"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Average Rating
                          </p>
                        </div>
                      </div>
                    </div>
                  </ChartCard>

                  <ChartCard title="Activity Overview">
                    <div className="h-64 md:h-80 relative">
                      <Bar data={barData} options={chartOptions.barOptions} />
                    </div>
                  </ChartCard>
                </div>
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
}> = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
  >
    <div className="flex items-start space-x-3">
      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="text-2xl font-bold text-primary mt-1">{value}</p>
      </div>
    </div>
  </motion.div>
);

const FeedbackCard: React.FC<{ feedback: any; onClick: () => void }> = ({
  feedback,
  onClick,
}) => {
  const formattedDate = useMemo(
    () =>
      new Date(feedback.interviewDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [feedback.interviewDate]
  );

  const previewSkills = useMemo(
    () => Object.entries(feedback.feedbackData).slice(0, 3),
    [feedback.feedbackData]
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-xl shadow-sm cursor-pointer border border-gray-100 hover:shadow-md transition-all h-full flex flex-col"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        {feedback.profilePhoto ? (
          <img
            src={feedback.profilePhoto}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium border-2 border-white shadow-sm">
            {feedback.candidateName[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-800 truncate">
            {feedback.candidateName}
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
              {(value as any).rating}/5
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
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
  >
    <p className="text-gray-500 text-sm md:text-base">{message}</p>
  </motion.div>
);

const FeedbackModal: React.FC<{ feedback: any; onClose: () => void }> = ({
  feedback,
  onClose,
}) => {
  const skillCategories = useMemo(() => {
    return Object.entries(feedback.feedbackData).sort(([a], [b]) => {
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
          {feedback.profilePhoto ? (
            <img
              src={feedback.profilePhoto}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium border-2 border-white shadow-sm">
              {feedback.candidateName[0]}
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
                    {(value as any).rating}/5
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base bg-gray-50 p-3 rounded-lg">
                {(value as any).comments || "No comments provided."}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(InterviewerStatistics);
