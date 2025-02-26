import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  User,
  Clock,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { InterviewerContext } from "../../context/InterviewerContext";
import Loader from "../../components/ui/Loader";
import CardSkeleton from "../../components/ui/CardSkeleton";

const CandidateModal: React.FC<{
  request: any;
  onClose: () => void;
}> = ({ request, onClose }) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 relative">
              {request.profilePhoto ? (
                <img
                  src={request.profilePhoto}
                  alt={request.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <User className="text-blue-600 w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-gray-900">
                {request.name}
              </h2>
              <p className="text-lg text-gray-600">{request.position}</p>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{request.date}</span>
                <span className="text-gray-300 mx-1">•</span>
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="font-medium">{request.time}</span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.skills?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              <a
                href={request.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">View Candidate Resume</span>
              </a>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                Interview Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  request.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : request.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {request.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InterviewRequests: React.FC = () => {
  const { interviewRequests, fetchInterviewRequests, updateInterviewRequest } =
    React.useContext(InterviewerContext)!;

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(
    new Set()
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchInterviewRequests();
    } finally {
      setIsLoading(false);
    }
  }, [fetchInterviewRequests]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedRequests = useMemo(
    () => [...interviewRequests].reverse(),
    [interviewRequests]
  );

  const handleResponse = useCallback(
    async (id: string, action: "Approved" | "Cancelled") => {
      setLoadingRequests((prev) => new Set(prev.add(id)));
      try {
        await updateInterviewRequest(id, action);
      } finally {
        setLoadingRequests((prev) => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      }
    },
    [updateInterviewRequest]
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <header className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Interview Requests
              <span className="text-gray-500 ml-2 text-lg sm:text-xl">
                ({interviewRequests.length})
              </span>
            </h1>
          </div>
        </header>

        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : sortedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {sortedRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-white rounded-xl border border-gray-100 hover:border-transparent shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 relative">
                          {request.profilePhoto ? (
                            <img
                              src={request.profilePhoto}
                              alt={request.name}
                              loading="lazy"
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <User className="text-blue-600" size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <h3 className="font-semibold text-gray-800 truncate text-lg">
                            {request.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {request.position}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{request.date}</span>
                            <span className="text-gray-300">|</span>
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">{request.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === "Approved"
                              ? "bg-green-50 text-green-700"
                              : request.status === "Cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {request.status}
                        </span>

                        {request.status === "Requested" && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResponse(request.id, "Approved");
                              }}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all ${
                                loadingRequests.has(request.id)
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md"
                              }`}
                              disabled={loadingRequests.has(request.id)}
                            >
                              {loadingRequests.has(request.id) ? (
                                <Loader className="w-4 h-4" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="hidden sm:inline">
                                    Accept
                                  </span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResponse(request.id, "Cancelled");
                              }}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all ${
                                loadingRequests.has(request.id)
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                              }`}
                              disabled={loadingRequests.has(request.id)}
                            >
                              {loadingRequests.has(request.id) ? (
                                <Loader className="w-4 h-4" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="hidden sm:inline">
                                    Decline
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-blue-500">📭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                No Pending Requests
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                New interview requests will appear here once candidates schedule
                sessions
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedRequest && (
          <CandidateModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(InterviewRequests);
