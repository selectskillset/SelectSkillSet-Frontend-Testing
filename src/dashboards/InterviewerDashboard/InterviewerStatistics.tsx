import { useEffect, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
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
import { Star, StarHalf, X } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";

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
  const [statistics, setStatistics] = useState<{
    completedInterviews: number;
    pendingRequests: number;
    totalAccepted: number;
    averageRating: number;
    totalFeedbackCount: number;
    feedbacks: Array<{
      feedbackData: Record<string, { rating: number; comments: string }>;
      rating: number;
      interviewRequestId: string;
      interviewDate: string;
      candidateName: string;
      profilePhoto: string;
    }>;
  } | null>(null);

  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get(
          "/interviewer/get-interviewer-statistics"
        );
        if (response.data && response.data.statistics) {
          setStatistics(response.data.statistics);
        } else {
          setStatistics(null);
        }
      } catch (error) {
        console.error("Error fetching interviewer statistics:", error);
        setStatistics(null);
      }
    };

    fetchStatistics();
  }, []);

  if (statistics === null) {
    return (
      <div className="bg-gray-50 p-8 max-w-6xl mx-auto rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">
          Interviewer Statistics
        </h2>
        <p className="text-center text-lg text-gray-500">
          No data available for the interviewer statistics at this time.
        </p>
      </div>
    );
  }

  const {
    completedInterviews,
    pendingRequests,
    totalAccepted,
    averageRating,
    totalFeedbackCount,
    feedbacks,
  } = statistics;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <div className="flex space-x-1">
        {[...Array(fullStars)].map((_, index) => (
          <Star key={`full-${index}`} className="text-yellow-400" />
        ))}
        {halfStar && <StarHalf className="text-yellow-400" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
          <Star key={`empty-${index}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  const handleOutsideClick = (e: any) => {
    if (e.target.id === "modal-overlay") {
      setSelectedFeedback(null);
    }
  };

  const feedbacksToDisplay = showAllFeedbacks
    ? feedbacks
    : feedbacks.slice(0, 4);

  return (
    <div className="bg-gray-50 p-8 max-w-7xl mx-auto rounded-lg shadow-md space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Interviewer Statistics
      </h2>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Completed Interviews
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {completedInterviews}
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold text-gray-900">{pendingRequests}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Accepted
          </h3>
          <p className="text-3xl font-bold text-gray-900">{totalAccepted}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Average Rating
          </h3>
          {renderStars(averageRating)}
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Feedback Count
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {totalFeedbackCount}
          </p>
        </div>
      </div>

      {/* Feedback Cards */}
      {feedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {feedbacksToDisplay.map((feedback, index) => (
            <div
              key={feedback.interviewRequestId}
              className="p-6 bg-white shadow-lg rounded-lg cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={() => setSelectedFeedback(feedback)}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Feedback {index + 1}
              </h4>
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src={feedback.profilePhoto}
                  alt={feedback.candidateName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {feedback.candidateName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {feedback.interviewDate}
                  </p>
                </div>
              </div>
              <div className="mt-2">{renderStars(feedback.rating)}</div>
              <p className="text-sm text-gray-600 mt-2">
                Total Rating: {feedback.rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500 mb-8">
          No feedback data available.
        </p>
      )}

      {/* View More Button */}
      {feedbacks.length > 4 && !showAllFeedbacks && (
        <div className="text-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            onClick={() => setShowAllFeedbacks(true)}
          >
            View More
          </button>
        </div>
      )}

      {/* Charts */}
      <div className="mb-8">
        {feedbacks.length > 0 && (
          <div className="bg-white p-6 shadow-md rounded-lg w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Feedback Ratings
            </h3>
            <Radar
              data={{
                labels: Object.keys(feedbacks[0].feedbackData),
                datasets: [
                  {
                    label: "Ratings",
                    data: Object.values(feedbacks[0].feedbackData).map(
                      (item) => item.rating
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: "Feedback Ratings" },
                },
                scales: {
                  r: {
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
              className="w-full h-[400px] sm:h-[500px] lg:h-[600px]"
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedFeedback && (
        <div
          id="modal-overlay"
          className="popup-container fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full mx-4 md:mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Detailed Feedback
            </h3>
            <div className="space-y-4">
              {Object.entries(selectedFeedback.feedbackData).map(
                ([key, value]) => (
                  <div key={key} className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-800">{key}</h4>
                    <p className="text-sm text-gray-600">
                      Rating: {value.rating}
                    </p>
                    <p className="text-sm text-gray-600">
                      Comments: {value.comments}
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

export default InterviewerStatistics;
