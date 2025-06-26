import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  MapPin,
  Briefcase,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";
import { format, parse } from "date-fns";
import { toast } from "sonner";

interface Experience {
  company: string;
  position: string;
  description: string;
  employmentType: string;
  location: string;
  totalExperience: string;
  startDate: string;
  endDate: string;
  current: boolean;
  _id: string;
}

interface InterviewRequest {
  _id: string;
  date: string;
  time: string;
  status: string;
  candidateName: string;
  position: string;
}

interface Interviewer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  jobTitle: string;
  experience: number;
  phoneNumber: string;
  location: string;
  price: number;
  skills: string[];
  isSuspended: boolean;
  isVerified: boolean;
  interviewRequests: InterviewRequest[];
  experiences: Experience[];
}

const InterviewerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
    interviewer: null as Interviewer | null,
    isLoading: true,
    isDropdownOpen: false,
    isDeleteModalOpen: false,
    isSuspendModalOpen: false,
    isVerifyModalOpen: false,
    suspensionReason: "",
    currentPage: 1,
    isUpdating: false,
  });

  const requestsPerPage = 3;

  const fetchInterviewer = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<{
        success: boolean;
        data: Interviewer;
      }>(`/admin/getOneInterviewer/${id}`);
      if (data.success) {
        setState((prev) => ({ ...prev, interviewer: data.data }));
      }
    } catch (error) {
      console.error("Error fetching interviewer:", error);
      toast.error("Failed to load interviewer details");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchInterviewer();
  }, [fetchInterviewer]);

  const handleVerification = useCallback(async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    try {
      const { data } = await axiosInstance.put(
        `/admin/verifyInterviewer/${id}`,
        { verify: !state.interviewer?.isVerified }
      );

      if (data.success && state.interviewer) {
        setState((prev) => ({
          ...prev,
          interviewer: {
            ...prev.interviewer,
            isVerified: !prev.interviewer.isVerified,
          },
          isVerifyModalOpen: false,
        }));
        toast.success(
          `Interviewer account ${
            !state.interviewer.isVerified ? "verified" : "unverified"
          } successfully`
        );
      }
    } catch (error) {
      toast.error("Failed to update verification status");
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  }, [state.interviewer, id]);

  const handleDeleteInterviewer = useCallback(async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    try {
      await axiosInstance.delete(`/admin/deleteOneInterviewer/${id}`);
      toast.success("Interviewer deleted successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Failed to delete interviewer");
    } finally {
      setState((prev) => ({
        ...prev,
        isUpdating: false,
        isDeleteModalOpen: false,
      }));
    }
  }, [id, navigate]);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const parsedDate = parse(dateString, "EEEE, M/d/yyyy", new Date());
      return format(parsedDate, "MMM do, yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const formatTime = useCallback((timeString: string): string => {
    try {
      const [time, period] = timeString.split(" ");
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes} ${period}`;
    } catch {
      return timeString;
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

  const totalRequests = useMemo(
    () => state.interviewer?.interviewRequests?.length || 0,
    [state.interviewer]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalRequests / requestsPerPage),
    [totalRequests]
  );

  const currentRequests = useMemo(
    () =>
      state.interviewer?.interviewRequests?.slice(
        (state.currentPage - 1) * requestsPerPage,
        state.currentPage * requestsPerPage
      ) || [],
    [state.interviewer, state.currentPage]
  );

  const handleStatusUpdate = useCallback(async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    try {
      const action = state.interviewer?.isSuspended ? "activate" : "suspend";
      const { data } = await axiosInstance.put(
        `/admin/toggleInterviewer/${id}`,
        {
          action,
          ...(action === "suspend" && { reason: state.suspensionReason }),
        }
      );

      if (data.success && state.interviewer) {
        setState((prev) => ({
          ...prev,
          interviewer: {
            ...prev.interviewer,
            isSuspended: !prev.interviewer.isSuspended,
          },
          suspensionReason: "",
          isSuspendModalOpen: false,
        }));
        toast.success(
          `Interviewer account ${
            action === "suspend" ? "suspended" : "activated"
          } successfully`
        );
      }
    } catch (error) {
      toast.error("Failed to update interviewer status");
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  }, [state.interviewer, state.suspensionReason, id]);

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

  const getCompanyLogoUrl = (companyName: string) => {
    const formattedName = companyName
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    return {
      clearbit: `http://logo.clearbit.com/${formattedName}.com`,
      initials: `https://api.dicebear.com/7.x/initials/svg?seed=${companyName.charAt(
        0
      )}&size=48&backgroundType=gradientLinear&fontWeight=500`,
    };
  };

  return (
    <div className="min-h-screen space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence>
        {state.interviewer?.isSuspended && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-100 p-4 flex items-center justify-center gap-3"
          >
            <AlertTriangle className="text-amber-600" />
            <span className="text-amber-800 font-medium">
              This account is currently suspended. All interview requests are
              paused.
            </span>
          </motion.div>
        )}

        {!state.interviewer?.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-100 p-4 flex items-center justify-center gap-3"
          >
            <AlertTriangle className="text-blue-600" />
            <span className="text-blue-800 font-medium">
              This account is not verified. Please verify after reviewing
              profile.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.isLoading ? (
          <ProfileSkeletonLoader />
        ) : !state.interviewer ? (
          <div className="text-center py-12 text-gray-500">
            Interviewer not found
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5 flex-1 min-w-[300px]">
                <div className="relative">
                  <img
                    src={
                      state.interviewer.profilePhoto ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={`${state.interviewer.firstName} ${state.interviewer.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                  />
                  {state.interviewer.isVerified ? (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full">
                      <BadgeCheck size={30} />
                    </div>
                  ) : (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full">
                      <AlertCircle size={30} />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {state.interviewer.firstName} {state.interviewer.lastName}
                  </h1>
                  <div className="mt-1 space-y-1">
                    <p className="text-gray-600">
                      {state.interviewer.jobTitle}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4" />
                      <span>
                        {state.interviewer.experience
                          ? `${state.interviewer.experience.split(" ")[0]}+`
                          : "N/A"}{" "}
                        years
                      </span>
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
                              isDropdownOpen: false,
                            }))
                          }
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                        >
                          Delete Account
                        </button>
                        <button
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              isVerifyModalOpen: true,
                              isDropdownOpen: false,
                            }))
                          }
                          className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 text-left"
                        >
                          {state.interviewer.isVerified
                            ? "Unverify Account"
                            : "Verify Account"}
                        </button>
                        <button
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              isSuspendModalOpen: true,
                              isDropdownOpen: false,
                            }))
                          }
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          {state.interviewer.isSuspended
                            ? "Activate Account"
                            : "Suspend Account"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" /> Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {state.interviewer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {state.interviewer.phoneNumber || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {state.interviewer.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing and Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Pricing
                  </h2>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${state.interviewer.price}/hour
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Technical
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {state.interviewer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" /> Experience
                  </h2>
                  <div className="space-y-4">
                    {state.interviewer.experiences?.map((exp, index) => {
                      const logoUrls = getCompanyLogoUrl(exp.company);
                      return (
                        <div
                          key={index}
                          className="mb-4 pb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0"
                        >
                          <div className="flex gap-4">
                            {/* Company Logo */}
                            <div className="flex-shrink-0">
                              <img
                                src={logoUrls.clearbit}
                                alt={exp.company}
                                className="w-12 h-12 rounded-lg object-contain border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    logoUrls.initials;
                                }}
                              />
                            </div>

                            {/* Experience Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-gray-800 font-medium text-lg">
                                    {exp.position}
                                  </h5>
                                  <p className="text-gray-700 font-medium">
                                    {exp.company}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {exp.location} ·{" "}
                                    {exp.employmentType || "Full-time"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    {exp.startDate} -{" "}
                                    {exp.current ? "Present" : exp.endDate}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {exp.totalExperience}
                                  </p>
                                </div>
                              </div>

                              {exp.description && (
                                <p className="mt-2 text-gray-600 text-sm">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Requests */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" /> Interview
                Requests
              </h2>
              {currentRequests.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-100">
                    {currentRequests.map((request) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-4"
                      >
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatDate(request.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatTime(request.time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className="capitalize text-gray-700">
                              {request.status.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            Candidate: {request.candidateName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Position: {request.position}
                          </p>
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
                  No interview requests found
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* Delete Modal */}
        {state.isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Delete Interviewer Account
              </h3>
              <p className="text-gray-600 mb-6">
                This action will permanently delete the interviewer account and
                all associated data. This cannot be undone.
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
                  disabled={state.isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInterviewer}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
                  disabled={state.isUpdating}
                >
                  {state.isUpdating ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Verification Modal */}
        {state.isVerifyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() =>
              setState((prev) => ({ ...prev, isVerifyModalOpen: false }))
            }
          >
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {state.interviewer?.isVerified
                  ? "Unverify Account"
                  : "Verify Account"}
              </h3>
              <p className="text-gray-600 mb-6">
                {state.interviewer?.isVerified
                  ? "This will mark the interviewer's profile as unverified."
                  : "This will mark the interviewer's profile as verified."}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isVerifyModalOpen: false,
                    }))
                  }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={state.isUpdating}
                >
                  {state.isUpdating
                    ? "Processing..."
                    : state.interviewer?.isVerified
                    ? "Confirm Unverify"
                    : "Confirm Verify"}
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
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {state.interviewer?.isSuspended
                  ? "Activate Account"
                  : "Suspend Account"}
              </h3>

              {!state.interviewer?.isSuspended && (
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Suspension Reason
                  </label>
                  <input
                    type="text"
                    id="reason"
                    value={state.suspensionReason}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        suspensionReason: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter reason for suspension"
                    required
                  />
                </div>
              )}

              <p className="text-gray-600 mb-6">
                {state.interviewer?.isSuspended
                  ? "This will reactivate the interviewer's account."
                  : "This will suspend the interviewer's account and pause all interview requests."}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isSuspendModalOpen: false,
                      suspensionReason: "",
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
                    (!state.interviewer?.isSuspended && !state.suspensionReason)
                  }
                >
                  {state.isUpdating
                    ? "Processing..."
                    : state.interviewer?.isSuspended
                    ? "Activate Account"
                    : "Suspend Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewerDetailsPage;
