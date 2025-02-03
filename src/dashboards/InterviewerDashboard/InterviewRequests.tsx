import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../components/common/axiosConfig";
import Loader from "../../components/ui/Loader"; // Ensure Loader is implemented properly

interface InterviewRequest {
  id: string;
  name: string;
  profilePhoto: string | null;
  position: string;
  date: string;
  day: string;
  status: string;
}

const InterviewRequests: React.FC = () => {
  const [requests, setRequests] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state for API call
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(
    new Set()
  ); // Track loading requests

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/interviewer/getInterviewRequests"
        );
        if (response.data && Array.isArray(response.data.interviewRequests)) {
          setRequests(response.data.interviewRequests);
        } else {
          console.error(
            "Invalid response format: 'interviewRequests' is missing or not an array."
          );
        }
      } catch (error) {
        console.error("Error fetching interview requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (
    id: string,
    action: "Approved" | "Cancelled"
  ) => {
    setLoadingRequests((prev) => new Set(prev.add(id))); // Add the request ID to the loading set
    try {
      const payload = { interviewRequestId: id, status: action };
      await axiosInstance.put("/interviewer/updateInterviewRequest", payload);

      // Update the request status in the state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: action } : request
        )
      );
    } catch (error) {
      console.error("Error handling response for request:", error);
    } finally {
      setLoadingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id); // Remove the request ID from the loading set
        return newSet;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Interview Requests
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader /> {/* Loader component when loading */}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex-shrink-0">
                <img
                  src={
                    request.profilePhoto ??
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={`${request.name} profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {request.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Position: {request.position}
                </p>
                <p className="text-sm text-gray-600">
                  Date: <strong>{request.date}</strong> ({request.day})
                </p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  request.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : request.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {request.status}
              </span>
              {request.status === "Requested" && (
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={() => handleResponse(request.id, "Approved")}
                    className={`relative px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition ${
                      loadingRequests.has(request.id)
                        ? "opacity-50 cursor-wait"
                        : ""
                    }`}
                    disabled={loadingRequests.has(request.id)}
                  >
                    {loadingRequests.has(request.id) && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Loader className="opacity-100" />
                      </div>
                    )}
                    {!loadingRequests.has(request.id) && "Approve"}
                  </button>
                  <button
                    onClick={() => handleResponse(request.id, "Cancelled")}
                    className={`relative px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition ${
                      loadingRequests.has(request.id)
                        ? "opacity-50 cursor-wait"
                        : ""
                    }`}
                    disabled={loadingRequests.has(request.id)}
                  >
                    {loadingRequests.has(request.id) && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Loader className="opacity-100" />
                      </div>
                    )}
                    {!loadingRequests.has(request.id) && "Cancel"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No interview requests at the moment.
        </p>
      )}
    </motion.div>
  );
};

export default InterviewRequests;
