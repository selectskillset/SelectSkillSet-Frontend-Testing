import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "../../components/common/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Briefcase,
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";
import { format, parse } from "date-fns";

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  _id: string;
}

interface Interview {
  interviewerId: string;
  date: string;
  from: string;
  to: string;
  price: string;
  status: string;
  _id: string;
}

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  profilePhoto: string;
  skills: string[];
  jobTitle: string;
  linkedIn: string;
  location: string;
  resume: string;
  phoneNumber: string;
  isSuspended: boolean;
  experiences: Experience[];
  scheduledInterviews: Interview[];
}

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
    candidate: null as Candidate | null,
    isLoading: true,
    isDropdownOpen: false,
    isDeleteModalOpen: false,
    isSuspendModalOpen: false,
    suspensionReason: "",
    currentPage: 1,
    isUpdating: false,
  });

  const interviewsPerPage = 2;

  const fetchCandidate = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<{
        success: boolean;
        data: Candidate;
      }>(`/admin/getOneCandidate/${id}`);
      if (data.success) {
        setState((prev) => ({ ...prev, candidate: data.data }));
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const formatExperienceDate = useCallback((dateString: string): string => {
    try {
      const [day, month, year] = dateString.split("/");
      const date = new Date(`${month}/${day}/${year}`);
      return format(date, "MMM yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const formatInterviewDate = useCallback((dateString: string): string => {
    try {
      const parsedDate = parse(dateString, "EEEE, M/d/yyyy", new Date());
      return format(parsedDate, "MMM do, yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "re-scheduled":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  }, []);

  const totalInterviews = useMemo(
    () => state.candidate?.scheduledInterviews?.length || 0,
    [state.candidate]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalInterviews / interviewsPerPage),
    [totalInterviews]
  );

  const currentInterviews = useMemo(
    () =>
      state.candidate?.scheduledInterviews?.slice(
        (state.currentPage - 1) * interviewsPerPage,
        state.currentPage * interviewsPerPage
      ) || [],
    [state.candidate, state.currentPage]
  );

  const handleStatusUpdate = useCallback(async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    try {
      const action = state.candidate?.isSuspended ? "activate" : "suspend";
      const { data } = await axiosInstance.put(`/admin/toggleCandidate/${id}`, {
        action,
        ...(action === "suspend" && { reason: state.suspensionReason }),
      });

      if (data.success) {
        setState((prev) => ({
          ...prev,
          candidate: prev.candidate
            ? {
                ...prev.candidate,
                isSuspended: !prev.candidate.isSuspended,
              }
            : null,
          suspensionReason: "",
          isSuspendModalOpen: false,
        }));
      }
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  }, [state.candidate, state.suspensionReason, id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setState((prev) => ({ ...prev, isDropdownOpen: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence>
        {state.candidate?.isSuspended && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-100 p-4 flex items-center justify-center gap-3"
          >
            <AlertTriangle className="text-amber-600" />
            <span className="text-amber-800 font-medium">
              This account is currently suspended. All interviews are paused.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.isLoading ? (
          <ProfileSkeletonLoader />
        ) : !state.candidate ? (
          <div className="text-center py-12 text-gray-500">
            Candidate not found
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1 min-w-[300px]">
                <img
                  src={state.candidate.profilePhoto || "/default-avatar.jpg"}
                  alt={`${state.candidate.firstName} ${state.candidate.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {state.candidate.firstName} {state.candidate.lastName}
                  </h1>
                  <div className="mt-1 space-y-1">
                    <p className="text-gray-600">{state.candidate.jobTitle}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{state.candidate.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isDropdownOpen: !prev.isDropdownOpen,
                    }))
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Actions menu"
                >
                  <MoreVertical className="text-gray-600" />
                </button>

                <AnimatePresence>
                  {state.isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        <button
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              isDeleteModalOpen: true,
                            }))
                          }
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          Delete Account
                        </button>
                        <button
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              isSuspendModalOpen: true,
                            }))
                          }
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          {state.candidate.isSuspended
                            ? "Activate Account"
                            : "Suspend Account"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Information */}
              <div className="bg-white rounded-xl  shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" /> Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {state.candidate.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {state.candidate.countryCode}{" "}
                      {state.candidate.phoneNumber}
                    </span>
                  </div>
                  {state.candidate.linkedIn && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-gray-400" />
                      <a
                        href={state.candidate.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {state.candidate.linkedIn.replace(
                          /^https?:\/\/[^/]+\//,
                          ""
                        )}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {state.candidate.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Resume
                  </h2>
                  {state.candidate.resume ? (
                    <a
                      href={state.candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </a>
                  ) : (
                    <p className="text-gray-500">No resume uploaded</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" /> Experience
                  </h2>
                  <div className="space-y-4">
                    {state.candidate.experiences?.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-indigo-100 pl-4"
                      >
                        <h3 className="font-medium text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatExperienceDate(exp.startDate)} -{" "}
                          {exp.current
                            ? "Present"
                            : formatExperienceDate(exp.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" /> Scheduled
                  Interviews
                </h2>
                {currentInterviews.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-100">
                      {currentInterviews.map((interview) => (
                        <motion.div
                          key={interview._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-4"
                        >
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {formatInterviewDate(interview.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {interview.from} - {interview.to}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(interview.status)}
                              <span className="capitalize text-gray-700">
                                {interview.status.toLowerCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Price: ${interview.price}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 flex justify-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                currentPage: idx + 1,
                              }))
                            }
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              state.currentPage === idx + 1
                                ? "bg-indigo-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No scheduled interviews
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Delete Modal */}
          {state.isDeleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              onClick={() =>
                setState((prev) => ({ ...prev, isDeleteModalOpen: false }))
              }
            >
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Delete Candidate Account
                </h3>
                <p className="text-gray-600 mb-6">
                  This action will permanently delete the candidate account and
                  all associated data.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        isDeleteModalOpen: false,
                      }))
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setState((prev) => ({ ...prev, isUpdating: true }));
                      try {
                        await axiosInstance.delete(
                          `/admin/deleteOneCandidate/${id}`
                        );
                        navigate("/admin/dashboard");
                      } finally {
                        setState((prev) => ({
                          ...prev,
                          isUpdating: false,
                          isDeleteModalOpen: false,
                        }));
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={state.isUpdating}
                  >
                    {state.isUpdating ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suspend/Activate Modal */}
          {state.isSuspendModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              onClick={() =>
                setState((prev) => ({ ...prev, isSuspendModalOpen: false }))
              }
            >
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {state.candidate?.isSuspended
                    ? "Activate Account"
                    : "Suspend Account"}
                </h3>
                {!state.candidate?.isSuspended && (
                  <textarea
                    value={state.suspensionReason}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        suspensionReason: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 mb-4"
                    rows={3}
                    placeholder="Enter suspension reason..."
                    aria-label="Suspension reason"
                  />
                )}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        isSuspendModalOpen: false,
                      }))
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    disabled={
                      state.isUpdating ||
                      (!state.candidate?.isSuspended && !state.suspensionReason)
                    }
                  >
                    {state.isUpdating
                      ? "Processing..."
                      : state.candidate?.isSuspended
                      ? "Activate Account"
                      : "Suspend Account"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CandidateDetailsPage;
