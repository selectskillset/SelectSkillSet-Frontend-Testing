// src/components/BookmarkedCandidatesPage.tsx
import React, { useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Bookmark, X } from "lucide-react";
import toast from "react-hot-toast";

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

// Static dummy data
const staticBookmarkedCandidates: Candidate[] = [
  {
    _id: "67a26b559abf3054e405c228",
    firstName: "Suleman",
    lastName: "Khan",
    email: "dev.suleman.khan@gmail.com",
    phoneNumber: "9373960682",
    location: "Nanded, Maharashtra",
    resume:
      "https://selectskillset.s3.eu-north-1.amazonaws.com/resumes/1738697715959-resume_new%20%281%29.pdf",
    skills: ["React", "Node.js", "Python", "Django"],
    profilePhoto:
      "https://selectskillset.s3.eu-north-1.amazonaws.com/profile-photos/1739305688366-premium_photo-1661297460381-f75b8ae69a0f.jpg",
    linkedIn: "https://www.linkedin.com/in/suleman-khan-304ab6279/",
    statistics: { averageRating: 3.7 },
  },
  {
    _id: "67a26b559abf3054e405c229",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phoneNumber: "9876543210",
    location: "Mumbai, Maharashtra",
    resume: "",
    skills: ["JavaScript", "Angular", "TypeScript"],
    profilePhoto: "https://via.placeholder.com/150",
    linkedIn: "https://www.linkedin.com/in/priya-sharma",
    statistics: { averageRating: 4.2 },
  },
  {
    _id: "67a26b559abf3054e405c230",
    firstName: "Amit",
    lastName: "Patel",
    email: "amit.patel@example.com",
    phoneNumber: "8765432109",
    location: "Bangalore, Karnataka",
    skills: ["Java", "Spring", "SQL"],
    profilePhoto: "https://via.placeholder.com/150",
    linkedIn: "",
    statistics: { averageRating: 4.0 },
  },
];

// Candidate Card Component
const CandidateCard = memo(({ candidate }: { candidate: Candidate }) => {
  const navigate = useNavigate();

  const handleViewProfile = useCallback(() => {
    // navigate(`/candidateProfile/${candidate._id}`);
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5"></div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Developer</p>
              <p className="mt-1 text-sm text-gray-500">This Is Dummy Data</p>
            </div>
          </div>
        </div>
       
      </div>
    ));
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
        <button
          onClick={handleRemoveBookmark}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-100"
          title="Remove Bookmark"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

// Main Component
const BookmarkedCandidatesPage: React.FC = () => {
  const navigate = useNavigate();

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

        {/* Candidates List */}
        <div className="space-y-4">
          {staticBookmarkedCandidates.length > 0 ? (
            staticBookmarkedCandidates.map((candidate, index) => (
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
      </div>
    </div>
  );
};

export default memo(BookmarkedCandidatesPage);
