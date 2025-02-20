// CandidateInterviews.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";
import profilePlaceholder from "../../images/interviewerProfile.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCandidateContext } from "../../context/CandidateContext";
import toast from "react-hot-toast";
import FindUserLoader from "../../components/ui/FindUserLoader";

const CandidateInterviews: React.FC = () => {
  const { interviewers, isLoadingInterviewers, fetchInterviewers } =
    useCandidateContext();

  useEffect(() => {
    if (!interviewers.length) {
      fetchInterviewers();
    }
  }, [interviewers, fetchInterviewers]);
  const [isFindingPerfectMatch, setIsFindingPerfectMatch] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered interviewers
  const filteredInterviewers = useMemo(
    () =>
      interviewers.filter(
        (interviewer) =>
          `${interviewer.firstName} ${interviewer.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          interviewer.skills?.some((skill: string) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      ),
    [interviewers, searchQuery]
  );

  // Paginated data
  const paginatedInterviewers = useMemo(
    () =>
      filteredInterviewers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredInterviewers, currentPage]
  );

  const totalPages = Math.ceil(filteredInterviewers.length / itemsPerPage);

  if (isLoadingInterviewers)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">
          Loading professionals...
        </div>
      </div>
    );

  // Error state
  // if (error)
  //   return (
  //     <div className="text-center text-red-500">
  //       <p>{error}</p>
  //     </div>
  //   );

  const handleFindPerfectInterviewer = async () => {
    setIsFindingPerfectMatch(true); // Start loader
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate API delay
    setIsFindingPerfectMatch(false); // Stop loader

    // Display toast notification
    toast.success("Here are the best-matched interviewers based on your skills!", {  
      duration: 4000,  
      position: "top-center",  
    });
    

    // Implement API call here if needed
    // Example: fetchPerfectMatches();
  };

  if(isFindingPerfectMatch){
    return <FindUserLoader/>
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Interviewers
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for interviewers or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
            />
          </div>
          <button
            onClick={handleFindPerfectInterviewer}
            className="flex items-center gap-2 px-6 py-3 bg-[#0077B5] text-white rounded-md hover:bg-[#005f8a] transition-colors"
          >
            <UserRoundSearch className="w-5 h-5" />
            Find Perfect Interviewer
          </button>
        </div>
      </div>

      {/* Interviewers List */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {paginatedInterviewers.length > 0 ? (
          paginatedInterviewers.map((interviewer) => (
            <InterviewerCard key={interviewer._id} interviewer={interviewer} />
          ))
        ) : (
          <p className="text-center text-gray-500">No interviewers found.</p>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-[#0077B5] disabled:text-gray-400 hover:bg-gray-100 rounded-md"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-[#0077B5] disabled:text-gray-400 hover:bg-gray-100 rounded-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Interviewer Card Component
const InterviewerCard: React.FC<{ interviewer: any }> = ({ interviewer }) => {
  const navigate = useNavigate();

  // Display only the first 10 skills and count the remaining
  const displaySkills = useMemo(() => {
    const skills = interviewer.skills || [];
    const visibleSkills = skills.slice(0, 10);
    const remainingCount =
      skills.length > 10 ? `+${skills.length - 10} more` : "";
    return { visibleSkills, remainingCount };
  }, [interviewer.skills]);

  // Check if the interviewer is highly rated (>= 4)
  const isHighlyRated = interviewer.averageRating >= 4;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border ${
        isHighlyRated ? "border-yellow-500 border-2" : "border-gray-200"
      } hover:shadow-lg transition-all duration-300 relative`}
    >
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-6">
          <img
            src={interviewer.profilePhoto || profilePlaceholder}
            alt={`${interviewer.firstName} ${interviewer.lastName}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#0077B5]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {interviewer.firstName} {interviewer.lastName}
              </h3>
              {isHighlyRated && (
                <div className="tooltip" data-tip="Highly Rated Interviewer">
                  <ShieldCheck className="w-6 h-6 text-[#0077B5]" />
                </div>
              )}
            </div>
            <p className="text-gray-600 text-base">
              {interviewer.jobTitle || "Technical Interviewer"}
            </p>
          </div>
          <button
            onClick={() => navigate(`/interviewer-profile/${interviewer._id}`)}
            className="text-[#0077B5] border-2 p-2 border-[#0077B5] text-sm font-medium rounded-md hover:bg-[#005f8a] hover:text-white transition-colors"
          >
            View Profile
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-sm mb-6">
          <div className="flex items-center text-gray-600">
            <Briefcase className="w-4 h-4 mr-1" />
            {interviewer.experience || 5}+ years
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 mr-1" />
            {interviewer.averageRating
              ? interviewer.averageRating.toFixed(1)
              : "0.0"}{" "}
            Rating
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-[#0077B5] font-medium text-lg">
            <DollarSign className="w-5 h-5 mr-1" />
            {interviewer.price}/hr
          </div>
          <div className="flex items-center text-sm text-green-600 bg-green-100 px-3 py-1 rounded">
            <Clock className="w-4 h-4 mr-1" />
            Available Now
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {displaySkills.visibleSkills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {displaySkills.remainingCount && (
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              {displaySkills.remainingCount}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {interviewer.completedInterviews || 0} interviews Completed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateInterviews;
