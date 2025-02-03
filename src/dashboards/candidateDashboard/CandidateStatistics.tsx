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

// Register chart.js components
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
  feedbackData: Record<string, { rating: number; comments: string }> | {};
  rating: number;
  interviewRequestId: string;
  interviewDate: string;
  interviewer: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
}

const CandidateStatistics = () => {
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

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get(
          "/candidate/get-candidate-statistics"
        );
        setStatistics(response.data.statistics);
      } catch (error) {
        console.error("Error fetching candidate statistics:", error);
        setStatistics(null); // Ensure no data state
      }
    };

    fetchStatistics();
  }, []);

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
    ? statistics?.feedbacks
    : statistics?.feedbacks.slice(0, 4);

  if (!statistics) {
    return (
      <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">
          Candidate Statistics
        </h2>
        <div className="text-center text-lg text-gray-600">
          Unable to fetch candidate statistics at the moment. Please try again
          later.
        </div>
      </div>
    );
  }

  const { completedInterviews, averageRating, totalFeedbackCount, feedbacks } =
    statistics;

  return (
    <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">
        Candidate Statistics
      </h2>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-semibold">Completed Interviews</h3>
          <p className="text-2xl font-bold">{completedInterviews}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-semibold">Average Rating</h3>
          {renderStars(averageRating)}
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h3 className="text-xl font-semibold">Feedback Count</h3>
          <p className="text-2xl font-bold">{totalFeedbackCount}</p>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {feedbacksToDisplay?.map((feedback, index) => (
          <div
            key={feedback.interviewRequestId}
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setSelectedFeedback(feedback)}
          >
            <h4 className="text-lg font-semibold mb-2">Feedback {index + 1}</h4>
            <div className="flex items-center space-x-4 mb-2">
              {feedback.interviewer.profilePhoto ? (
                <img
                  src={feedback.interviewer.profilePhoto}
                  alt="interviewer"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {feedback.interviewer.firstName[0]}
                    {feedback.interviewer.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {feedback.interviewer.firstName}{" "}
                  {feedback.interviewer.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {feedback.interviewDate}
                </p>
              </div>
            </div>
            <div className="mt-2">{renderStars(feedback.rating)}</div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {feedbacks.length > 4 && !showAllFeedbacks && (
        <div className="text-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
            onClick={() => setShowAllFeedbacks(true)}
          >
            View More
          </button>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Feedback Ratings</h3>
          {feedbacks.length > 0 ? (
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
                plugins: { title: { display: true, text: "Feedback Ratings" } },
              }}
            />
          ) : (
            <div className="text-center text-lg text-gray-600">
              No feedback data available for ratings.
            </div>
          )}
        </div>

        {/* Doughnut Chart for Average Rating */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Average Rating Distribution
          </h3>
          <Doughnut
            data={{
              labels: ["Excellent", "Good", "Average", "Below Average", "Poor"],
              datasets: [
                {
                  label: "Average Rating Distribution",
                  data: [
                    averageRating >= 4 ? 1 : 0,
                    averageRating >= 3 && averageRating < 4 ? 1 : 0,
                    0,
                    0,
                    0,
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
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Modal for Detailed Feedback */}
      {selectedFeedback && (
        <div
          id="modal-overlay"
          className="popup-container fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full mx-4 md:mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">Detailed Feedback</h3>
            <div className="space-y-4">
              {Object.entries(selectedFeedback.feedbackData).map(
                ([key, value]) => (
                  <div key={key} className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold">{key}</h4>
                    <p className="text-sm">Rating: {value.rating}</p>
                    <p className="text-sm">Comments: {value.comments}</p>
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
