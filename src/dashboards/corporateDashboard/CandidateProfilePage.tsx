import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Linkedin,
  FileText,
  Bookmark,
  Heart,
  Star,
  X,
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";

interface Feedback {
  interviewRequestId: string;
  feedbackData: Record<
    string,
    {
      rating: number;
      comments: string;
    }
  >;
  rating: number;
  date: string;
  _id: string;
}

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  location: string;
  profilePhoto: string;
  linkedIn: string;
  resume: string;
  skills: string[];
  statistics: {
    averageRating: number;
    feedbacks: Feedback[];
  };
  isBookmarked: boolean;
}

const CandidateProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const [state, setState] = useState<{
    candidate: Candidate | null;
    isLoading: boolean;
    isDropdownOpen: boolean;
    isBookmarked: boolean;
    isWishlisted: boolean;
    error: string | null;
  }>({
    candidate: null,
    isLoading: true,
    isDropdownOpen: false,
    isBookmarked: false,
    isWishlisted: false,
    error: null,
  });

  const fetchCandidate = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data } = await axiosInstance.get(
        `/corporate/getOneCandidate/${id}`
      );

      if (data && data._id) {
        setState((prev) => ({
          ...prev,
          candidate: data,
          isBookmarked: data.isBookmarked,
        }));
      } else {
        throw new Error("No valid candidate data found in response");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setState((prev) => ({ ...prev, error: message }));
      toast.error(message);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

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

  const toggleBookmark = useCallback(async () => {
    try {
      const endpoint = state.isBookmarked
        ? "/corporate/unbookmarkCandidate"
        : "/corporate/bookmarkCandidate";

      // Optimistic update
      setState((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));

      await axiosInstance.post(endpoint, { candidateId: id });

      toast.success(
        state.isBookmarked ? "Removed from bookmarks" : "Candidate bookmarked",
        {
          duration: 2000,
        }
      );
    } catch (error) {
      // Rollback on error
      setState((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
      toast.error("Failed to update bookmark");
      console.error("Bookmark error:", error);
    }
  }, [id, state.isBookmarked]);

  const toggleWishlist = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, isWishlisted: !prev.isWishlisted };
      toast.success(
        newState.isWishlisted
          ? "Candidate added to wishlist"
          : "Removed from wishlist",
        { duration: 2000 }
      );
      return newState;
    });
  }, []);

  const handleEmailContact = useCallback(() => {
    if (state.candidate?.email) {
      window.location.href = `mailto:${state.candidate.email}`;
      toast.success("Opening email client", { duration: 2000 });
    } else {
      toast.error("No email available");
    }
  }, [state.candidate?.email]);

  const fullPhoneNumber = useMemo(() => {
    return state.candidate?.countryCode && state.candidate?.phoneNumber
      ? `${state.candidate.countryCode} ${state.candidate.phoneNumber}`
      : state.candidate?.phoneNumber || "Not provided";
  }, [state.candidate]);

  const openFeedbackModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedFeedback(null);
  };

  const renderFeedbackModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={closeFeedbackModal}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#0077b5]">
              Detailed Feedback
            </h3>
            <button
              onClick={closeFeedbackModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {selectedFeedback && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Overall Rating
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(selectedFeedback.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {selectedFeedback.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#0077b5]">
                  Category Ratings
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(selectedFeedback.feedbackData).map(
                    ([category, data]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-700">
                            {category}
                          </h5>
                          <span className="text-sm bg-[#0077b5] text-white px-2 py-1 rounded-full">
                            {data.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {data.comments || "No comments provided"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef] antialiased">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.isLoading ? (
          <ProfileSkeletonLoader />
        ) : state.error ? (
          <div className="text-center py-12 text-red-500">{state.error}</div>
        ) : !state.candidate ? (
          <div className="text-center py-12 text-gray-500">
            Candidate not found
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <img
                  src={
                    state.candidate.profilePhoto ||
                    "https://via.placeholder.com/150"
                  }
                  alt={`${state.candidate.firstName} ${state.candidate.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#0077b5] shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h1 className="text-2xl font-semibold text-[#0077b5]">
                    {state.candidate.firstName} {state.candidate.lastName}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm">
                    {state.candidate.location || "Location not specified"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-700 text-sm">
                      {state.candidate.statistics.averageRating.toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  className={`flex items-center space-x-2 ${
                    state.isBookmarked ? "text-yellow-500" : "text-gray-500"
                  }`}
                  onClick={toggleBookmark}
                >
                  <Bookmark
                    size={20}
                    fill={state.isBookmarked ? "currentColor" : "none"}
                    />
                    <span>{state.isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
                
                <button
                  onClick={handleEmailContact}
                  className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> Contact
                </button>
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" /> Contact Information
                </h2>
                <div className="space-y-4 text-gray-700 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{state.candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{fullPhoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                    {state.candidate.linkedIn ? (
                      <a
                        href={state.candidate.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0077b5] hover:underline truncate"
                      >
                        {state.candidate.linkedIn.split(
                          "linkedin.com/in/"
                        )[1] || "View Profile"}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {state.candidate.skills?.length ? (
                      state.candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#0077b5]/10 text-[#0077b5] text-sm rounded-full shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> Resume
                  </h2>
                  {state.candidate.resume ? (
                    <a
                      href={state.candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#0077b5] text-white rounded-md hover:bg-[#005885] transition-colors text-sm font-medium shadow-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" /> View Resume
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">No resume uploaded</p>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-[#0077b5] mb-4">
                Performance Overview
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2 sm:col-span-1">
                  <div className="bg-[#f8f9fa] p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Average Rating
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-[#0077b5]">
                        {state.candidate.statistics.averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i <
                              Math.round(
                                state.candidate.statistics.averageRating
                              )
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#0077b5]">
                    Interview Feedback History
                  </h3>
                  <span className="text-sm text-gray-500">
                    {state.candidate.statistics.feedbacks.length} records
                  </span>
                </div>

                <div className="space-y-3">
                  {state.candidate.statistics.feedbacks.map(
                    (feedback, index) => (
                      <motion.div
                        key={feedback._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white hover:bg-gray-50 border rounded-lg p-4 cursor-pointer transition-all"
                        onClick={() => openFeedbackModal(feedback)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-700">
                              Interview #{index + 1}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {feedback.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(feedback.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {feedback.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {isFeedbackModalOpen && renderFeedbackModal()}
      </main>
    </div>
  );
};

export default CandidateProfilePage;
