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
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { Star, X } from "lucide-react";
import { InterviewerContext } from "../../context/InterviewerContext";
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
  LineElement
);

const InterviewerStatistics = () => {
  const { statistics, fetchStatistics } = useContext(InterviewerContext);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

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
      { id: "ratings", label: "Analysis" },
    ],
    []
  );

  const chartData = useMemo(
    () => ({
      bar: {
        labels: ["Completed", "Pending", "Accepted"],
        datasets: [
          {
            label: "Interview Stats",
            data: [completedInterviews, pendingRequests, totalAccepted],
            backgroundColor: ["#0ea5e9", "#94a3b8", "#cbd5e1"],
            borderWidth: 0,
            borderRadius: 8,
          },
        ],
      },
      radar: feedbacks[0]?.feedbackData
        ? {
            labels: Object.keys(feedbacks[0].feedbackData),
            datasets: [
              {
                label: "Skill Ratings",
                data: Object.values(feedbacks[0].feedbackData).map(
                  (v: any) => v.rating
                ),
                backgroundColor: "rgba(14, 165, 233, 0.2)",
                borderColor: "#0ea5e9",
                pointBackgroundColor: "#0ea5e9",
              },
            ],
          }
        : null,
    }),
    [completedInterviews, pendingRequests, totalAccepted, feedbacks]
  );

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSelectedFeedback(null);
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Performance Insights
        </h1>
        <p className="text-slate-600 mt-2">
          Detailed analytics of your interview activities
        </p>
      </motion.header>

      <nav className="border-b border-slate-200 mb-8">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 px-1 font-medium relative transition-colors
                ${
                  activeTab === tab.id
                    ? "text-sky-600 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-sky-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard label="Completed" value={completedInterviews} />
              <StatCard label="Pending" value={pendingRequests} />
              <StatCard label="Accepted" value={totalAccepted} />
              <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-6">
                  Activity Overview
                </h3>
                <div className="h-64">
                  <Bar
                    data={chartData.bar}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          grid: { color: "#f1f5f9" },
                          ticks: { color: "#64748b" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "#64748b" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedbacks" && (
            <FeedbackSection
              feedbacks={feedbacks}
              onSelect={setSelectedFeedback}
            />
          )}

          {activeTab === "ratings" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-6">Skill Analysis</h3>
              {chartData.radar ? (
                <div className="h-96">
                  <Radar
                    data={chartData.radar}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 5,
                          grid: { color: "#f1f5f9" },
                          ticks: { stepSize: 1, color: "#64748b" },
                          pointLabels: { color: "#0f172a" },
                        },
                      },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  No feedback data available for analysis
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <FeedbackModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
  >
    <h3 className="text-sm font-medium text-slate-600 mb-2">{label}</h3>
    <p className="text-3xl font-semibold text-slate-900">{value}</p>
  </motion.div>
);

const FeedbackSection = ({
  feedbacks,
  onSelect,
}: {
  feedbacks: any[];
  onSelect: (feedback: any) => void;
}) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {feedbacks.length ? (
      feedbacks.map((feedback) => (
        <motion.div
          key={feedback.interviewRequestId}
          whileHover={{ scale: 0.98 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer"
          onClick={() => onSelect(feedback)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-slate-900">
                {feedback.candidateName}
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                {new Date(feedback.interviewDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={18} />
              <span className="font-medium">{feedback.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4 line-clamp-3">
            {feedback.feedbackData?.overall?.comments}
          </p>
        </motion.div>
      ))
    ) : (
      <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-500">No feedback available yet</p>
      </div>
    )}
  </div>
);

const FeedbackModal = ({
  feedback,
  onClose,
}: {
  feedback: any;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {feedback && (
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
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Feedback Details
                </h3>
                <p className="text-slate-500 mt-1">
                  {new Date(feedback.interviewDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(feedback.feedbackData).map(([category, data]) => (
                <div key={category} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-slate-900 capitalize">
                      {category}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={18} />
                      <span className="font-medium">
                        {(data as any).rating}/5
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {(data as any).comments || "No comments provided"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const LoadingState = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-pulse space-y-6 w-full max-w-2xl">
      <div className="h-8 bg-slate-200 rounded-full w-1/2" />
      <div className="h-4 bg-slate-200 rounded-full w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default React.memo(InterviewerStatistics);
