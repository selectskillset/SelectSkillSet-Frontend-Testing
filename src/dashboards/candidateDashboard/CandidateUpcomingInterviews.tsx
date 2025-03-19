import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCandidateContext } from "../../context/CandidateContext";
import {
  Clock,
  Search,
  UserCheck,
  XCircle,
  Watch,
  Timer,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import CandidateRescheduleModal from "../../components/common/CandidateRescheduleModal";

interface Interview {
  id: string;
  date: string;
  time: string;
  interviewerName: string;
  status: string;
  interviewerPhoto?: string;
  from: string;
  to: string;
  additionalNotes?: string;
  interviewerId: string;
}

const CandidateUpcomingInterviews: React.FC = () => {
  const { interviews, isLoading, fetchInterviews, error, rescheduleInterview } =
    useCandidateContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [reschedulingInterview, setReschedulingInterview] =
    useState<Interview | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Memoized interview processing
  const processedInterviews = useMemo(() => {
    const filtered = interviews.filter(
      (interview) =>
        interview.interviewerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        interview.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [interviews, searchQuery]);

  // Pagination logic
  const paginatedInterviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedInterviews.slice(startIndex, startIndex + itemsPerPage);
  }, [processedInterviews, currentPage]);

  const totalPages = Math.ceil(processedInterviews.length / itemsPerPage);

  // Fetch interviews on mount
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Status styling generator
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

  // Click outside handler for dropdown menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId && !(e.target as Element).closest(`#menu-${openMenuId}`)) {
        setOpenMenuId(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-500"
        >
          Loading interviews...
        </motion.div>
      </div>
    );

  // Error state
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 text-center p-8"
      >
        <XCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-6 border border-gray-100 rounded-xl bg-white shadow-sm my-5"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Upcoming Interviews
          </h1>
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all"
            aria-label="Search interviews"
          />
        </div>
      </div>

      {/* Interview List */}
      <ul className="space-y-3">
        <AnimatePresence>
          {paginatedInterviews.map((interview, index) => (
            <InterviewItem
              key={interview.id}
              interview={interview}
              index={index}
              getStatusStyle={getStatusStyle}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              setReschedulingInterview={setReschedulingInterview}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Empty State */}
      {!processedInterviews.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Watch className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-gray-500 mt-4">No upcoming interviews found</p>
        </motion.div>
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {reschedulingInterview &&
          reschedulingInterview.status === "Approved" && (
            <CandidateRescheduleModal
              request={reschedulingInterview}
              onClose={() => setReschedulingInterview(null)}
              onReschedule={async (data) => {
                try {
                  await rescheduleInterview(data.id, {
                    newDate: data.newDate,
                    isoDate: data.isoDate,
                    from: data.startTime,
                    to: data.endTime,
                  });
                  await fetchInterviews();
                } catch (error) {
                  console.error("Rescheduling failed:", error);
                  throw error;
                }
              }}
            />
          )}
      </AnimatePresence>
    </motion.div>
  );
};

interface InterviewItemProps {
  interview: Interview;
  index: number;
  getStatusStyle: (status: string) => string;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setReschedulingInterview: React.Dispatch<
    React.SetStateAction<Interview | null>
  >;
}

const InterviewItem: React.FC<InterviewItemProps> = ({
  interview,
  index,
  getStatusStyle,
  openMenuId,
  setOpenMenuId,
  setReschedulingInterview,
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all "
    >
      <Link
        to={`/interviewer-profile/${interview.interviewerId}`}
        className="block space-y-3"
        aria-label={`View ${interview.interviewerName}'s profile`}
      >
        {/* Interviewer Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-[#0A66C2] overflow-hidden">
              <img
                src={interview.interviewerPhoto || "/default-avatar.png"}
                alt={interview.interviewerName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {interview.interviewerName || "Interview Session"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            {interview.status === "Approved" && (
              <div className="relative">
                <button
                  id={`menu-${interview.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenuId(
                      openMenuId === interview.id ? null : interview.id
                    );
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Interview options"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                <AnimatePresence>
                  {openMenuId === interview.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 min-w-[160px] z-10 border border-gray-100"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setReschedulingInterview(interview);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                        aria-label="Reschedule interview"
                      >
                        <Clock className="w-4 h-4 text-blue-500" />
                        Reschedule
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
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
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`w-8 h-8 rounded-lg text-sm ${
              currentPage === index + 1
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default React.memo(CandidateUpcomingInterviews);
