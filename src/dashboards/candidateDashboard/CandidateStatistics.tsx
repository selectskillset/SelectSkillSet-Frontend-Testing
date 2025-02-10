import { useEffect, useState } from "react";
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
import { Star, StarHalf, X } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";

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

interface Feedback {
  feedbackData: Record<string, any>;
  rating: number;
  interviewRequestId: string;
  interviewDate: string;
  interviewer: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

const CandidateStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<{
    completedInterviews: number;
    averageRating: number;
    totalFeedbackCount: number;
    feedbacks: Feedback[];
  } | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

  // Fetch candidate statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get(
          "/candidate/get-candidate-statistics"
        );
        setStatistics(response.data.statistics);
      } catch (error) {
        console.error("Error fetching candidate statistics:", error);
        setStatistics(null);
      }
    };
    fetchStatistics();
  }, []);

  // Render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={index} className="w-4 h-4 text-yellow-500" />
        ))}
        {halfStar && <StarHalf className="w-4 h-4 text-yellow-500" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
          <Star key={index} className="w-4 h-4 text-gray-300" />
        ))}
      </>
    );
  };

  // Handle modal close
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedFeedback(null);
    }
  };

  // Limit feedbacks to display
  const feedbacksToDisplay = showAllFeedbacks
    ? statistics?.feedbacks
    : statistics?.feedbacks.slice(0, 4);

  if (!statistics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-gray-700 text-center">
          Unable to fetch candidate statistics at the moment. Please try again
          later.
        </p>
      </div>
    );
  }

  const { completedInterviews, averageRating, totalFeedbackCount, feedbacks } =
    statistics;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
  };

  // Radar Chart Data
  const radarChartData = {
    labels: Object.keys(feedbacks[0]?.feedbackData || {}),
    datasets: [
      {
        label: "Feedback Ratings",
        data: Object.values(feedbacks[0]?.feedbackData || {}).map(
          (item: any) => item.rating
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  // Doughnut Chart Data
  const doughnutChartData = {
    labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        label: "Average Rating Distribution",
        data: [
          averageRating >= 4 ? 1 : 0,
          averageRating >= 3 && averageRating < 4 ? 1 : 0,
          averageRating >= 2 && averageRating < 3 ? 1 : 0,
          averageRating >= 1 && averageRating < 2 ? 1 : 0,
          averageRating < 1 ? 1 : 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Bar Chart Data
  const barChartData = {
    labels: feedbacks.map(
      (f) => `${f.interviewer.firstName} ${f.interviewer.lastName}`
    ),
    datasets: [
      {
        label: "Overall Ratings",
        data: feedbacks.map((f) => f.rating),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Candidate Statistics
      </h1>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm">Completed Interviews</p>
          <p className="text-xl font-semibold text-gray-800">
            {completedInterviews}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm">Average Rating</p>
          <div className="flex items-center justify-center space-x-1">
            {renderStars(averageRating)}
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {averageRating.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm">Total Feedback Count</p>
          <p className="text-xl font-semibold text-gray-800">
            {totalFeedbackCount}
          </p>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Feedbacks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {feedbacksToDisplay?.map((feedback, index) => (
            <div
              key={index}
              onClick={() => setSelectedFeedback(feedback)}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
            >
              <p className="text-sm font-medium text-gray-600">
                Feedback {index + 1}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {feedback.interviewer.profilePhoto ? (
                  <img
                    src={feedback.interviewer.profilePhoto}
                    alt="Interviewer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {feedback.interviewer.firstName[0]}
                    {feedback.interviewer.lastName[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {feedback.interviewer.firstName}{" "}
                    {feedback.interviewer.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {feedback.interviewDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                {renderStars(feedback.rating)}
              </div>
              <p className="text-sm text-gray-800 mt-2">
                {feedback.rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
        {feedbacks.length > 4 && !showAllFeedbacks && (
          <button
            onClick={() => setShowAllFeedbacks(true)}
            className="mt-4 text-[#0077B5] hover:underline"
          >
            View More
          </button>
        )}
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Radar Chart */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Feedback Ratings
          </h3>
          {feedbacks.length > 0 ? (
            <div className="w-full h-64 sm:h-96">
              <Radar data={radarChartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-gray-600">No feedback data available.</p>
          )}
        </div>

        {/* Doughnut Chart */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Average Rating Distribution
          </h3>
          <div className="w-full h-64 sm:h-96">
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Overall Ratings by Interviewers
          </h3>
          {feedbacks.length > 0 ? (
            <div className="w-full h-64 sm:h-96">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-gray-600">No feedback data available.</p>
          )}
        </div>
      </div>

      {/* Modal for Detailed Feedback */}
      {selectedFeedback && (
        <div
          id="modal-overlay"
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Detailed Feedback
            </h3>
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(selectedFeedback.feedbackData).map(
                ([key, value], index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm font-medium text-gray-800">{key}</p>
                    <p className="text-sm text-gray-600">
                      Rating: {value.rating}/5
                    </p>
                    <p className="text-sm text-gray-600">
                      Comments: {value.comments || "No comments provided."}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateStatistics;
