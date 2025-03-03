import React, { useCallback, memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Bookmark, X } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";

// Interface for a candidate
interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  resume?: string;
  skills: string[];
  profilePhoto?: string;
  linkedIn?: string;
  statistics: { averageRating: number };
}

// Candidate Card Component
const CandidateCard = memo(({ candidate }: { candidate: Candidate }) => {
  const navigate = useNavigate();

  const handleViewProfile = useCallback(() => {
    navigate(`/candidateProfile/${candidate._id}`);
  }, [candidate._id, navigate]);

  const handleRemoveBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering view profile
      console.log(
        `Removed bookmark for ${candidate.firstName} ${candidate.lastName}`
      );
      // Add dynamic removal logic here later
    },
    [candidate.firstName, candidate.lastName]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onClick={handleViewProfile}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0077b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={candidate.profilePhoto || "https://via.placeholder.com/40"}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#0077b5] shadow-sm"
            loading="lazy"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#0077b5] leading-tight">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {candidate.location || "Not specified"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-[#0077b5]/10 text-[#0077b5] text-xs rounded-md shadow-sm"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{candidate.skills.length - 3}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">
                {candidate.statistics.averageRating.toFixed(1)} / 5
              </span>
            </div>
          </div>
        </div>
       
      </div>
    </motion.div>
  );
});

// Main Component
const BookmarkedCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState<Candidate[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarked candidates from the API
  useEffect(() => {
    const fetchBookmarkedCandidates = async () => {
      try {
        const response = await axiosInstance.get(
          "/corporate/getBookmarkedCandidates"
        );

        const candidates = response.data.bookmarkedCandidates.map(
          (item: { candidate: Candidate }) => item.candidate
        );
        setBookmarkedCandidates(candidates);
      } catch (err) {
        console.error("Error fetching bookmarked candidates:", err);
        setError("Failed to load bookmarked candidates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedCandidates();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    navigate("/corporate-dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-[#0077b5]" />
            <div>
              <h1 className="text-xl font-semibold text-[#0077b5]">
                Bookmarked Candidates
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Manage your curated list of top talent
              </p>
            </div>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-1.5 rounded-md hover:bg-[#005885] transition-colors text-sm font-medium shadow-sm w-full sm:w-auto"
          >
            Back to Dashboard
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-500 text-sm">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></span>
            Loading bookmarked candidates...
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Candidates List */}
        {!loading && !error && (
          <div className="space-y-4">
            {bookmarkedCandidates.length > 0 ? (
              bookmarkedCandidates.map((candidate, index) => (
                <CandidateCard key={candidate._id} candidate={candidate} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12 text-gray-500 text-sm"
              >
                No bookmarked candidates found
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BookmarkedCandidatesPage);
