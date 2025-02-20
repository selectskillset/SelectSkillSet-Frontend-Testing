import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCandidateContext } from "../../context/CandidateContext";
import { Clock, Search, UserCheck, XCircle, Watch, Timer } from "lucide-react";

const CandidateUpcomingInterviews: React.FC = () => {
  const { interviews, isLoading, fetchInterviews, error } =
    useCandidateContext();

  // Fetch interviews if not already loaded
  useEffect(() => {
    if (!interviews.length) {
      fetchInterviews();
    }
  }, [interviews, fetchInterviews]);

  const [searchQuery, setSearchQuery] = useState("");

  // Memoized sorted interviews (latest first)
  const sortedInterviews = useMemo(
    () =>
      [...interviews].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [interviews]
  );

  // Memoized filtered interviews
  const filteredInterviews = useMemo(
    () =>
      sortedInterviews.filter(
        (interview) =>
          interview.interviewerName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          interview.status?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [sortedInterviews, searchQuery]
  );

  // Status styling utility
  const getStatusStyle = useCallback((status: string) => {
    const base = "flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Approved":
        return `${base} bg-[#E3F2FD] text-[#0A66C2]`;
      case "Cancelled":
        return `${base} bg-[#FFEBEE] text-[#D32F2F]`;
      case "Requested":
        return `${base} bg-[#FFF3E0] text-[#EF6C00]`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  }, []);

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading interviews...</div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="text-red-600 text-center p-8">
        <XCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-6 border border-gray-100"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upcoming Interviews
          </h2>
          <p className="text-gray-600 mt-1">
            Your scheduled interview sessions
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
          />
        </div>
      </div>

      {/* Interview List */}
      {filteredInterviews.length > 0 ? (
        <ul className="space-y-3">
          {filteredInterviews.reverse().map((interview, index) => (
            <motion.li
              key={interview.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <Link
                to={`/interviewer-profile/${interview.interviewerId}`}
                className="block space-y-3"
              >
                {/* Interviewer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-[#0A66C2] overflow-hidden">
                      <img
                        src={
                          interview.interviewerPhoto ||
                          "https://via.placeholder.com/150"
                        }
                        alt={interview.interviewerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.interviewerName || "Interview Session"}
                      </h3>
                     
                    </div>
                  </div>
                  <span className={getStatusStyle(interview.status)}>
                    {interview.status === "Approved" && (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    {interview.status === "Cancelled" && (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {interview.status === "Requested" && (
                      <Timer className="w-4 h-4 mr-2" />
                    )}
                    {interview.status}
                  </span>
                </div>

                {/* Interview Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#0A66C2]" />
                    <span>{interview.date}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">
                      {interview.from} - {interview.to}
                    </span>
                    <span className="ml-1">GMT</span>
                  </div>
                </div>

                {/* Additional Info */}
                {interview.additionalNotes && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {interview.additionalNotes}
                  </p>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <Watch className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-4">No upcoming interviews found</p>
        </div>
      )}
    </motion.div>
  );
};

export default CandidateUpcomingInterviews;
