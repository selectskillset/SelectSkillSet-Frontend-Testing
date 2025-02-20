// src/components/CandidateProfilePage.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";

// Interface matching your API response
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
  statistics: { averageRating: number };
}

const CandidateProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch candidate data with error handling
  const fetchCandidate = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data } = await axiosInstance.get(
        `/corporate/getOneCandidate/${id}`
      );
      console.log("API Response:", data); // Debug: Log the full response

      // Since your response is the candidate object directly
      if (data && data._id) {
        setState((prev) => ({ ...prev, candidate: data }));
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

  // Handle clicks outside dropdown
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

  // Handlers for actions
  const toggleBookmark = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, isBookmarked: !prev.isBookmarked };
      toast.success(
        newState.isBookmarked
          ? "Candidate bookmarked"
          : "Removed from bookmarks",
        { duration: 2000 }
      );
      return newState;
    });
  }, []);

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

  // Memoized derived values
  const fullPhoneNumber = useMemo(() => {
    return state.candidate?.countryCode && state.candidate?.phoneNumber
      ? `${state.candidate.countryCode} ${state.candidate.phoneNumber}`
      : state.candidate?.phoneNumber || "Not provided";
  }, [state.candidate]);

  return (
    <div className="min-h-screen bg-[#f3f2ef] antialiased">
      {/* Suspension Warning Banner */}

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

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full ${
                    state.isBookmarked
                      ? "bg-[#0077b5] text-white"
                      : "bg-gray-100 text-gray-600"
                  } hover:bg-[#005885] hover:text-white transition-colors`}
                  title={state.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-2 rounded-full ${
                    state.isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  } hover:bg-red-600 hover:text-white transition-colors`}
                  title={
                    state.isWishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEmailContact}
                  className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> Contact
                </button>
              </div>
            </motion.div>

            {/* Details Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Information */}
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

              {/* Skills and Resume */}
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

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-[#0077b5] mb-4">
                Additional Information
              </h2>
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Average Rating:</strong>{" "}
                  {state.candidate.statistics.averageRating.toFixed(1)} / 5
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateProfilePage;
