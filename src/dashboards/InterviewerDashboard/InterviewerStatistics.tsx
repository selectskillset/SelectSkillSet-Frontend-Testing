import React, {
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
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
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { Star, X } from "lucide-react";
import { InterviewerContext } from "../../context/InterviewerContext";
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

const InterviewerStatistics = () => {
  const { statistics, fetchStatistics } = useContext(InterviewerContext);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
   
      fetchStatistics();
  
  }, [ fetchStatistics]);

  const isLoading = !statistics;

  const {
    completedInterviews,
    pendingRequests,
    totalAccepted,
    feedbacks = [],
  } = statistics || {};

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "feedbacks", label: "Feedbacks" },
      { id: "ratings", label: "Feedbacks Analysis" },
    ],
    []
  );

  const renderStars = useCallback((rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < fullStars
                ? "text-yellow-400"
                : hasHalfStar && index === fullStars
                ? "text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  }, []);

  const feedbacksToDisplay = useMemo(
    () => (showAllFeedbacks ? feedbacks : feedbacks.slice(0, 3)),
    [feedbacks, showAllFeedbacks]
  );

  const barChartData = useMemo(
    () => ({
      labels: ["Completed", "Pending", "Accepted"],
      datasets: [
        {
          label: "Interview Stats",
          data: [completedInterviews, pendingRequests, totalAccepted],
          backgroundColor: ["#0A66C2", "#FFD700", "#2E7D32"],
          borderWidth: 0,
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    }),
    [completedInterviews, pendingRequests, totalAccepted]
  );

  const radarData = useMemo(() => {
    if (!feedbacks.length || !feedbacks[0]?.feedbackData) return null;
    return {
      labels: Object.keys(feedbacks[0].feedbackData),
      datasets: [
        {
          label: "Skill Ratings",
          data: Object.values(feedbacks[0].feedbackData).map(
            (v: any) => v.rating
          ),
          backgroundColor: "rgba(10, 102, 194, 0.2)",
          borderColor: "#0A66C2",
          pointBackgroundColor: "#0A66C2",
          pointBorderColor: "#fff",
        },
      ],
    };
  }, [feedbacks]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSelectedFeedback(null);
  }, []);

  const handleFeedbackClick = useCallback((feedback: any) => {
    setSelectedFeedback(feedback);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedFeedback(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg text-gray-500">
          Loading statistics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Performance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Analytics for your interview performance
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-4 px-1 font-medium ${
                activeTab === tab.id
                  ? "text-[#0A66C2] border-b-2 border-[#0A66C2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Completed Interviews", value: completedInterviews },
                { label: "Pending Requests", value: pendingRequests },
                { label: "Total Accepted", value: totalAccepted },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <h3 className="text-gray-500 font-medium mb-2">
                    {item.label}
                  </h3>
                  <p className="text-4xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
              <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">
                  Activity Overview
                </h3>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "feedbacks" && (
            <div className="space-y-6">
              {feedbacks.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500 text-lg">
                    No feedbacks available yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {feedbacksToDisplay.map((feedback) => (
                      <motion.div
                        key={feedback.interviewRequestId}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                        onClick={() => handleFeedbackClick(feedback)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {feedback.candidateName}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {feedback.interviewDate}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-900">
                              {feedback.rating.toFixed(1)}
                            </span>
                            <Star className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm text-gray-600 line-clamp-3">
                            {feedback.feedbackData?.overall?.comments}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {feedbacks.length > 3 && !showAllFeedbacks && (
                    <div className="text-center">
                      <button
                        className="px-6 py-2.5 bg-[#0A66C2] text-white rounded-lg font-medium hover:bg-[#0056b3] transition-colors shadow-sm"
                        onClick={() => setShowAllFeedbacks(true)}
                      >
                        Show All Feedbacks
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "ratings" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-6">Feedbacks Analysis</h3>
              {feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No feedbacks available for analysis.
                  </p>
                </div>
              ) : !radarData ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Feedback data is incomplete or unavailable for analysis.
                  </p>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 5,
                          ticks: {
                            stepSize: 1,
                            color: "#6B7280",
                            backdropColor: "transparent",
                          },
                          grid: { color: "#f3f4f6" },
                          pointLabels: { color: "#374151" },
                        },
                      },
                      plugins: { legend: { display: false } },
                      elements: { line: { tension: 0.3 } },
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Detailed Feedback
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {selectedFeedback.interviewDate}
                    </p>
                  </div>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(selectedFeedback.feedbackData).map(
                    ([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {key}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-gray-900">
                              {(value as any).rating.toFixed(1)}
                            </span>
                            <Star className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {(value as any).comments}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(InterviewerStatistics);
