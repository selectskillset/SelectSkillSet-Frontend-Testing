import React, { useCallback, memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Bookmark } from "lucide-react";
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className="fill-gray-300 text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onClick={handleViewProfile}
    >
      <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4 flex-1">
          <img
            src={candidate.profilePhoto || "https://via.placeholder.com/40"}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
            loading="lazy"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary leading-tight">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {candidate.location || "Not specified"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md shadow-sm"
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
              {renderStars(candidate.statistics.averageRating)}
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
    <div className="container mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className=" p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold text-primary">
                Bookmarked Candidates
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Manage your curated list of top talent
              </p>
            </div>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium shadow-sm w-full sm:w-auto"
          >
            Back to Dashboard
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-500 text-sm">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-primary rounded-full border-t-transparent mr-2"></span>
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
