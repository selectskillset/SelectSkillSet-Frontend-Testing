import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  User,
  Clock,
  Calendar,
  FileText,
  X,
  MoreVertical,
  BadgeCheck,
  Loader as LoaderIcon,
} from "lucide-react";
import { useInterviewer } from "../../context/InterviewerContext";
import { toast } from "sonner";

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const useEscapeKey = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") callback();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

const CandidateModal: React.FC<{
  request: any;
  onClose: () => void;
}> = ({ request, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(modalRef, onClose);
  useEscapeKey(onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
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
              {request.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <BadgeCheck
                    className="text-blue-500 fill-blue-100"
                    size={20}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-gray-900">
                {request.name || "Unknown Candidate"}
              </h2>
              <p className="text-lg text-gray-600">
                {request.position || "N/A"}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{request.date || "TBD"}</span>
                <span className="text-gray-300 mx-1">•</span>
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="font-medium">{request.time || "TBD"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.skills?.length > 0 ? (
                  request.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No skills listed
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
              {request.resume ? (
                <a
                  href={request.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">View Candidate Resume</span>
                </a>
              ) : (
                <span className="text-sm text-gray-500">
                  No resume available
                </span>
              )}
            </div>

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
                    : request.status === "RescheduleRequested"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {request.status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InterviewerRescheduleModal: React.FC<{
  request: any;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string) => Promise<void>;
}> = ({ request, onClose, onConfirm }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [newDate, setNewDate] = useState(request.date);
  const [newTime, setNewTime] = useState(request.time);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useOutsideClick(modalRef, onClose);
  useEscapeKey(onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(newDate, newTime);
      toast.success("Interview rescheduled successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to reschedule interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Reschedule Interview
            </h2>
            <p className="text-gray-600">
              Select a new date and time for the interview
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                {request.name || "Unknown Candidate"}
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Date
              </label>
              <input
                type="date"
                id="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Time
              </label>
              <input
                type="time"
                id="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Confirm Reschedule"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RequestCard: React.FC<{
  request: any;
  onView: () => void;
  onResponse: (id: string, action: "Approved" | "Cancelled") => Promise<void>;
  onReschedule: (request: any) => void;
  isLoading: boolean;
}> = ({ request, onView, onResponse, onReschedule, isLoading }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setOpenMenu(false));

  const handleResponse = async (
    e: React.MouseEvent,
    action: "Approved" | "Cancelled"
  ) => {
    e.stopPropagation();
    await onResponse(request.id, action);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
    >
      <div className="p-5 cursor-pointer" onClick={onView}>
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
            {request.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <BadgeCheck className="text-blue-500 fill-blue-100" size={16} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 truncate">
                  {request.name || "Unknown"}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {request.position || "N/A"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  request.status === "Approved"
                    ? "bg-green-50 text-green-700"
                    : request.status === "Cancelled"
                    ? "bg-red-50 text-red-700"
                    : request.status === "RescheduleRequested"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {request.status || "Pending"}
              </span>
            </div>

            <div className="mt-2  items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {" "}
                <Calendar className="w-4 h-4 text-blue-500" />
                {request.date || "TBD"}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500" />
                {request.time || "TBD"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {request.status === "Requested" ? (
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleResponse(e, "Approved")}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isLoading
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {isLoading ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">Accept</span>
                </button>

                <button
                  onClick={(e) => handleResponse(e, "Cancelled")}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isLoading
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {isLoading ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">Decline</span>
                </button>
              </div>
            ) : (
              (request.status === "Approved" ||
                request.status === "RescheduleRequested") && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(!openMenu);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  <AnimatePresence>
                    {openMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 min-w-[160px] z-[9999] border border-gray-100"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReschedule(request);
                            setOpenMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                        >
                          <Clock className="w-4 h-4 text-blue-500" />
                          Reschedule
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 space-y-4"
    >
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
    </motion.div>
  );
};

const InterviewRequests: React.FC = () => {
  const {
    interviewRequests,
    fetchInterviewRequests,
    updateInterviewRequest,
    rescheduleInterviewRequest,
  } = useInterviewer()!;

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reschedulingRequest, setReschedulingRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(
    new Set()
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchInterviewRequests();
    } catch (error) {
      toast.error("Failed to fetch interview requests");
      console.error("Failed to fetch interview requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchInterviewRequests]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedRequests = useMemo(
    () =>
      [...interviewRequests].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [interviewRequests]
  );

  const handleResponse = useCallback(
    async (id: string, action: "Approved" | "Cancelled") => {
      setLoadingRequests((prev) => new Set(prev.add(id)));
      try {
        await updateInterviewRequest(id, action);
        toast.success(`Request ${action.toLowerCase()} successfully`);
      } catch (error) {
        toast.error(`Failed to ${action.toLowerCase()} request`);
        console.error(`Failed to ${action} interview request:`, error);
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

  const handleReschedule = useCallback(
    async (id: string, newDate: string, newTime: string) => {
      setLoadingRequests((prev) => new Set(prev.add(id)));
      try {
        await rescheduleInterviewRequest(id, newDate, newTime);
        toast.success("Interview rescheduled successfully");
        setReschedulingRequest(null);
      } catch (error) {
        toast.error("Failed to reschedule interview");
        console.error("Failed to reschedule interview:", error);
        throw error;
      } finally {
        setLoadingRequests((prev) => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      }
    },
    [rescheduleInterviewRequest]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <header className="p-6 sm:p-8 border-b">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Interview Requests
            <span className="text-gray-500 ml-2 text-lg sm:text-xl">
              ({interviewRequests.length})
            </span>
          </h1>
        </header>

        <div className="p-6 sm:p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                      <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {sortedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onView={() => setSelectedRequest(request)}
                    onResponse={handleResponse}
                    onReschedule={setReschedulingRequest}
                    isLoading={loadingRequests.has(request.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState />
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
        {reschedulingRequest && (
          <InterviewerRescheduleModal
            request={reschedulingRequest}
            onClose={() => setReschedulingRequest(null)}
            onConfirm={handleReschedule}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(InterviewRequests);
