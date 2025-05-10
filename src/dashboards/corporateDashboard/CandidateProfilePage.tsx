import { useState, useEffect, useCallback, useMemo } from "react";
import {toast} from "sonner";
import axiosInstance from "../../components/common/axiosConfig";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Linkedin,
  FileText,
  Bookmark,
  Briefcase,
  Star,
  X,
} from "lucide-react";
import ProfileSkeletonLoader from "../../components/ui/ProfileSkeletonLoader";
import { format, parse } from "date-fns";

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
  from: string;
  to: string;
}

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
  experiences: Experience[];
  isBookmarked: boolean;
}

const CandidateProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<{
    candidate: Candidate | null;
    isLoading: boolean;
    isBookmarked: boolean;
    error: string | null;
  }>({
    candidate: null,
    isLoading: true,
    isBookmarked: false,
    error: null,
  });

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const fetchCandidate = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/corporate/getOneCandidate/${id}`
      );
      setState((prev) => ({
        ...prev,
        candidate: data,
        isBookmarked: data?.isBookmarked ?? false,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      }));
      toast.error("Failed to fetch candidate details");
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const toggleBookmark = useCallback(async () => {
    try {
      const newBookmarkState = !state.isBookmarked;
      setState((prev) => ({ ...prev, isBookmarked: newBookmarkState }));

      await axiosInstance.post(
        newBookmarkState
          ? "/corporate/bookmarkCandidate"
          : "/corporate/unbookmarkCandidate",
        { candidateId: id }
      );

      toast.success(
        newBookmarkState ? "Bookmarked candidate" : "Removed bookmark"
      );
    } catch (error) {
      setState((prev) => ({ ...prev, isBookmark: !prev.isBookmarked }));
      toast.error("Failed to update bookmark");
    }
  }, [id, state.isBookmarked]);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yy", new Date());
      return format(parsedDate, "MMM yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const formatFeedbackDate = useCallback((dateString: string): string => {
    try {
      const parsedDate = parse(dateString, "EEEE, M/d/yyyy", new Date());
      return format(parsedDate, "MMM do, yyyy");
    } catch {
      return dateString;
    }
  }, []);

  const formattedPhone = useMemo(() => {
    const { countryCode, phoneNumber } = state.candidate ?? {};
    if (!phoneNumber) return "Not provided";
    return [countryCode, phoneNumber.slice(0, 5), phoneNumber.slice(5)].join(
      " "
    );
  }, [state.candidate]);

  const formattedExperiences = useMemo(() => {
    return (
      state.candidate?.experiences?.map((exp) => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: exp.current ? "Present" : formatDate(exp.endDate),
      })) || []
    );
  }, [state.candidate?.experiences, formatDate]);

  if (state.isLoading) return <ProfileSkeletonLoader />;

  if (state.error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {state.error}
      </div>
    );
  }

  if (!state.candidate) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Candidate not found
      </div>
    );
  }

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
    <div className="min-h-screen  antialiased">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <img
              src={state.candidate.profilePhoto || "/default-avatar.jpg"}
              alt={`${state.candidate.firstName} ${state.candidate.lastName}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0077b5]"
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
                  {state.candidate.statistics.averageRating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 ${
                state.isBookmarked ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <Bookmark
                size={20}
                fill={state.isBookmarked ? "currentColor" : "none"}
              />
              <span className="text-sm">
                {state.isBookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </button>
            <a
              href={`mailto:${state.candidate.email}`}
              className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] text-sm"
            >
              <Mail size={16} />
              Contact
            </a>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              Contact Information
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{state.candidate.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{formattedPhone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-gray-400" />
                {state.candidate.linkedIn ? (
                  <a
                    href={state.candidate.linkedIn}
                    target="_blank"
                    rel="noopener"
                    className="text-[#0077b5] hover:underline truncate"
                  >
                    {state.candidate.linkedIn.replace(
                      /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                      ""
                    )}
                  </a>
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Skills & Experience */}
          <div className="space-y-6">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {state.candidate.skills?.length ? (
                  state.candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#0077b5]/10 text-[#0077b5] text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Resume
              </h2>
              {state.candidate.resume ? (
                <a
                  href={state.candidate.resume}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] text-sm"
                >
                  <FileText size={16} />
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mt-6"
        >
          <h2 className="text-lg font-semibold text-[#0077b5] mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-500" />
            Work Experience
          </h2>
          <div className="space-y-4">
            {formattedExperiences.length === 0 ? (
              <p className="text-gray-500">No experience listed</p>
            ) : (
              formattedExperiences.map((exp, index) => {
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
              })
            )}
          </div>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mt-6"
        >
          <h2 className="text-lg font-semibold text-[#0077b5] mb-4">
            Interview Feedback
          </h2>
          <div className="space-y-4">
            {state.candidate.statistics.feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFeedback(feedback)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Interview {index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFeedbackDate(feedback.date)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {feedback.from} - {feedback.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
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
                    <span className="text-gray-700 font-medium">
                      {feedback.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedFeedback && (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setSelectedFeedback(null)}
            >
              <motion.div
                animate={{ scale: 1 }}
                className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#0077b5]">
                      Feedback Details
                    </h3>
                    <button
                      onClick={() => setSelectedFeedback(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-700">
                        {formatFeedbackDate(selectedFeedback.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-700">
                        {selectedFeedback.from} - {selectedFeedback.to}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(selectedFeedback.feedbackData).map(
                      ([category, data]) => (
                        <div
                          key={category}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-700">
                              {category}
                            </h4>
                            <span className="bg-[#0077b5] text-white px-2 py-1 rounded-full text-sm">
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CandidateProfilePage;
