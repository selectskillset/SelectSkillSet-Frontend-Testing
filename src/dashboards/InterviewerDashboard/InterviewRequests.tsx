import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../../components/ui/Loader";
import { CheckCircle, XCircle } from "lucide-react"; // Import Lucide icons
import { InterviewerContext } from "../../context/InterviewerContext";
import CardSkeleton from "../../components/ui/CardSkeleton";

const InterviewRequests: React.FC = () => {
  const { interviewRequests, fetchInterviewRequests, updateInterviewRequest } =
    React.useContext(InterviewerContext)!;

  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(
    new Set()
  );

  // Fetch interview requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchInterviewRequests();
      } catch (error) {
        console.error("Error fetching interview requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchInterviewRequests]);

  // Handle approve/cancel actions for a request
  const handleResponse = async (
    id: string,
    action: "Approved" | "Cancelled"
  ) => {
    setLoadingRequests((prev) => new Set(prev.add(id)));
    try {
      await updateInterviewRequest(id, action);
    } catch (error) {
      console.error("Error handling response for request:", error);
    } finally {
      setLoadingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Reverse the array to display the latest requests at the top
  const sortedRequests = [...interviewRequests].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 my-5 max-w-7xl mx-auto"
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        Interview Requests
        <span className="text-gray-500 ml-2 text-lg">
          ({interviewRequests.length})
        </span>
      </h2>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : sortedRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              {/* Profile Photo and Details */}
              <div className="flex items-start">
                <img
                  src={
                    request.profilePhoto || "https://via.placeholder.com/150"
                  }
                  alt={`${request.name}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {request.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {request.position}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="mr-2">🗓</span>
                    <span>{request.date}</span>
                    <span className="mx-1">·</span>
                    <span>{request.day}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge and Action Buttons */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : request.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {request.status}
                </span>

                {request.status === "Requested" && (
                  <div className="flex gap-2">
                    {/* Approve Button */}
                    <button
                      onClick={() => handleResponse(request.id, "Approved")}
                      className={`relative px-3 py-2 text-sm font-medium rounded-full flex items-center gap-1 ${
                        loadingRequests.has(request.id)
                          ? "bg-gray-200 text-gray-500 cursor-wait"
                          : "bg-green-500 text-white hover:bg-green-600"
                      } transition-colors`}
                      disabled={loadingRequests.has(request.id)}
                    >
                      {loadingRequests.has(request.id) ? (
                        <Loader className="w-4 h-4" />
                      ) : (
                        <>
                          <CheckCircle size={16} /> Accept
                        </>
                      )}
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => handleResponse(request.id, "Cancelled")}
                      className={`relative px-3 py-2 text-sm font-medium rounded-full flex items-center gap-1 ${
                        loadingRequests.has(request.id)
                          ? "bg-gray-200 text-gray-500 cursor-wait"
                          : "bg-red-500 text-white hover:bg-red-600"
                      } transition-colors`}
                      disabled={loadingRequests.has(request.id)}
                    >
                      {loadingRequests.has(request.id) ? (
                        <Loader className="w-4 h-4" />
                      ) : (
                        <>
                          <XCircle size={16} /> Decline
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Requests Message
        <div className="text-center py-12">
          <div className="text-gray-500 text-4xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">No pending interview requests</p>
          <p className="text-sm text-gray-500 mt-2">
            New requests will appear here when candidates schedule interviews
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(InterviewRequests);
