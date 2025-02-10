import React, { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";

const InterviewerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [state, setState] = useState({
    interviewer: null,
    isLoading: true,
    isDropdownOpen: false,
    isDeleteModalOpen: false,
    isSuspendModalOpen: false,
    suspensionReason: "",
    currentPage: 1,
    isUpdating: false,
  });

  const requestsPerPage = 3;

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/admin/getOneInterviewer/${id}`
        );
        if (data.success) {
          setState((prev) => ({ ...prev, interviewer: data.data }));
        }
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchInterviewer();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setState((prev) => ({ ...prev, isDropdownOpen: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusUpdate = async () => {
    setState((prev) => ({ ...prev, isUpdating: true }));
    try {
      const action = state.interviewer.isSuspended ? "activate" : "suspend";
      const { data } = await axiosInstance.put(
        `/admin/toggleInterviewer/${id}`,
        {
          action,
          ...(action === "suspend" && { reason: state.suspensionReason }),
        }
      );

      if (data.success) {
        setState((prev) => ({
          ...prev,
          interviewer: {
            ...prev.interviewer,
            isSuspended: !prev.interviewer.isSuspended,
          },
          suspensionReason: "",
          isSuspendModalOpen: false,
        }));
      }
    } finally {
      setState((prev) => ({ ...prev, isUpdating: false }));
    }
  };

  // Derived values
  const totalRequests = state.interviewer?.interviewRequests?.length || 0;
  const totalPages = Math.ceil(totalRequests / requestsPerPage);
  const currentRequests = state.interviewer?.interviewRequests?.slice(
    (state.currentPage - 1) * requestsPerPage,
    state.currentPage * requestsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Suspension Warning Banner */}
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
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1 min-w-[300px]">
                <img
                  src={
                    state.interviewer.profilePhoto ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {state.interviewer.firstName} {state.interviewer.lastName}
                  </h1>
                  <div className="mt-1 space-y-1">
                    <p className="text-gray-600">
                      {state.interviewer.jobTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {state.interviewer.experience} years experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isDropdownOpen: !prev.isDropdownOpen,
                    }))
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                          {state.interviewer.isSuspended
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" /> Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-700">Email: </span>
                      <span className="text-gray-600">
                        {state.interviewer.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-700">Phone: </span>
                      <span className="text-gray-600">
                        {state.interviewer.phoneNumber || "Not provided"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Location:{" "}
                      </span>
                      <span className="text-gray-600">
                        {state.interviewer.location}
                      </span>
                    </div>
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

              {/* Interview Requests */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" /> Interview
                  Requests
                </h2>
                {currentRequests?.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-100">
                      {currentRequests.map((request, index) => (
                        <div key={index} className="py-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {request.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {request.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {request.status === "Approved" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
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
                        </div>
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
              <div
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Delete Interviewer Account
                </h3>
                <p className="text-gray-600 mb-6">
                  This action will permanently delete the interviewer's account
                  and all associated data.
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
                    onClick={() => {
                      setState((prev) => ({ ...prev, isUpdating: true }));
                      axiosInstance
                        .delete(`/admin/deleteOneInterviewer/${id}`)
                        .finally(() => {
                          setState((prev) => ({
                            ...prev,
                            isUpdating: false,
                            isDeleteModalOpen: false,
                          }));
                          navigate("/admin/dashboard");
                        });
                    }}
                    disabled={state.isUpdating}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
              <div
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {state.interviewer?.isSuspended
                    ? "Activate Account"
                    : "Suspend Account"}
                </h3>
                {!state.interviewer?.isSuspended && (
                  <textarea
                    value={state.suspensionReason}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        suspensionReason: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 mb-4"
                    rows={3}
                    placeholder="Enter suspension reason..."
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
                    disabled={state.isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={
                      state.isUpdating ||
                      (!state.interviewer?.isSuspended &&
                        !state.suspensionReason)
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {state.isUpdating
                      ? "Processing..."
                      : state.interviewer?.isSuspended
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

export default InterviewerDetailsPage;
