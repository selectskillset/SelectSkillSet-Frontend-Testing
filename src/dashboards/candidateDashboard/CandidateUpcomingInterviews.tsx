import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCandidate } from "../../context/CandidateContext";
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
  Calendar,
  Mail,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import CandidateRescheduleModal from "../../components/common/CandidateRescheduleModal";

interface Interview {
  id: string;
  date: string;
  time: string;
  interviewerName: string;
  status: "Approved" | "Cancelled" | "Requested" | "Completed" | "Rescheduled";
  interviewerPhoto?: string;
  from: string;
  to: string;
  additionalNotes?: string;
  interviewerId: string;
}

const statusConfig = {
  Approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "Approved",
  },
  Cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "Cancelled",
  },
  Requested: {
    icon: Timer,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    label: "Requested",
  },
  Completed: {
    icon: UserCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Completed",
  },
  Rescheduled: {
    icon: RefreshCw,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Rescheduled",
  },
};

const CandidateUpcomingInterviews: React.FC = () => {
  const { interviews, isLoading, fetchInterviews, error, rescheduleInterview } =
    useCandidate();

  const [searchQuery, setSearchQuery] = useState("");
  const [reschedulingInterview, setReschedulingInterview] =
    useState<Interview | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Memoized interview processing
  const processedInterviews = useMemo(() => {
    const filtered = interviews.filter(
      (interview) =>
        interview?.interviewerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        interview.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <RefreshCw className="animate-spin w-8 h-8" />
          <span>Loading interviews...</span>
        </motion.div>
      </div>
    );

  // Error state
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Failed to load interviews
        </h3>
        <p className="text-gray-600 max-w-md">{error}</p>
        <button
          onClick={fetchInterviews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            aria-label="Search interviews"
          />
        </div>
      </div>

      {/* Interview Cards Grid */}
      {processedInterviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {paginatedInterviews.map((interview, index) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  index={index}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  setReschedulingInterview={setReschedulingInterview}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl"
        >
          <Watch className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">
            No interviews scheduled
          </h3>
          <p className="text-gray-400 max-w-md text-center">
            You don't have any upcoming interviews. Book a session to get
            started.
          </p>
        </motion.div>
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {reschedulingInterview && (
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

interface InterviewCardProps {
  interview: Interview;
  index: number;
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setReschedulingInterview: React.Dispatch<
    React.SetStateAction<Interview | null>
  >;
}

const InterviewCard: React.FC<InterviewCardProps> = React.memo(
  ({ interview, index, openMenuId, setOpenMenuId, setReschedulingInterview }) => {
    const status = statusConfig[interview.status] || statusConfig.Requested;
    const StatusIcon = status.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden group"
      >
        {/* Status Ribbon */}
        <div
          className={`${status.bgColor} ${status.color} px-4 py-2 flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{status.label}</span>
          </div>
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
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white/30 rounded-lg transition-colors"
                aria-label="Interview options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {openMenuId === interview.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 w-40 z-10 border border-gray-100"
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

        <div className="p-5 space-y-4">
          {/* Interviewer Header */}
          <Link
            to={`/interviewer-profile/${interview.interviewerId}`}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={interview.interviewerPhoto || "/default-avatar.png"}
                alt={interview.interviewerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {interview.interviewerName}
              </h3>
              <p className="text-xs text-gray-500">Interview Session</p>
            </div>
          </Link>

          {/* Interview Details */}
          <div className="space-y-1">
            <div className="flex flex-wrap text-sm">
              <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span>
                  {interview.from} - {interview.to}
                </span>
              </div>
            </div>

            {interview.additionalNotes && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="line-clamp-2">{interview.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              to={`/interviewer-profile/${interview.interviewerId}`}
              className="inline-flex items-center  hover:underline text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Profile
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="flex items-center justify-center w-8 h-8 text-gray-400">
                ...
              </span>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
          <button
            key={startPage + index}
            onClick={() => onPageChange(startPage + index)}
            className={`w-8 h-8 rounded-lg text-sm transition-colors ${
              currentPage === startPage + index
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {startPage + index}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="flex items-center justify-center w-8 h-8 text-gray-400">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
});

export default React.memo(CandidateUpcomingInterviews);