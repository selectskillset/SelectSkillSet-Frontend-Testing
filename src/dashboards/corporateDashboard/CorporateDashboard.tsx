// src/components/CorporateDashboard.tsx
import React, { useCallback, memo, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Filter, Bookmark, Heart, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCorporateContext } from "../../context/CorporateContext";

// Interfaces
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

interface CorporateProfile {
  contactName: string;
  email: string;
  profilePhoto: string;
  phoneNumber: string;
  countryCode: string;
  companyName: string;
  bookmarks: Array<{ candidateId: string }>;
}

// Constants
const CANDIDATES_PER_PAGE = 5;

// Profile Sidebar Component
const ProfileSidebar = memo(({ profile }: { profile: CorporateProfile }) => (
  <aside className="bg-white shadow-lg rounded-xl h-max p-6 lg:w-80 m-4 sticky top-24 border border-gray-100">
    <div className="flex flex-col items-center">
      <img
        src={profile.profilePhoto || "https://via.placeholder.com/100"}
        alt={`${profile.companyName} profile`}
        className="w-20 h-20 rounded-full mb-4 border-2 border-[#0077b5] object-cover shadow-md"
        loading="lazy"
      />
      <h2 className="text-xl font-semibold text-[#0077b5] text-center">
        {profile.companyName}
      </h2>
      <p className="text-sm text-gray-600 text-center">{profile.contactName}</p>
      <div className="mt-6 border-t border-gray-200 pt-4 w-full space-y-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Email</span>
          <span className="text-[#0077b5]">{profile.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Phone</span>
          <span className="text-[#0077b5]">{`${profile.countryCode} ${profile.phoneNumber}`}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Bookmarks</span>
          <span className="text-[#0077b5] font-semibold">
            {profile.bookmarks.length}
          </span>
        </div>
      </div>
    </div>
  </aside>
));

// Candidate Table Component
const CandidateTable = memo(
  ({
    candidates,
    loading,
    onFilter,
    onSelect,
  }: {
    candidates: Candidate[];
    loading: boolean;
    onFilter: () => void;
    onSelect: (id: string) => void;
  }) => (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Candidates</h2>
        <button
          onClick={onFilter}
          className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] transition-colors text-sm font-medium shadow-sm"
        >
          <Filter size={16} /> Filter Candidates
        </button>
      </div>
      {loading ? (
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-md animate-pulse"
              />
            ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f7f9fa] text-gray-600 border-b">
              <tr>
                <th className="py-3 px-4 font-medium">Profile</th>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Skills</th>
                <th className="py-3 px-4 font-medium">Location</th>
                <th className="py-3 px-4 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <motion.tr
                    key={candidate._id}
                    whileHover={{ backgroundColor: "#f5f7f8" }}
                    className="border-b last:border-b-0 cursor-pointer transition-colors"
                    onClick={() => onSelect(candidate._id)}
                  >
                    <td className="py-4 px-4">
                      <img
                        src={
                          candidate.profilePhoto ||
                          "https://via.placeholder.com/40"
                        }
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        loading="lazy"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {`${candidate.firstName} ${candidate.lastName}`}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {candidate.skills.slice(0, 3).join(", ") || "N/A"}
                      {candidate.skills.length > 3 && "..."}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {candidate.location || "Not specified"}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {candidate.statistics.averageRating.toFixed(1)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No candidates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
);

// Main Component
const CorporateDashboard: React.FC = () => {
  const { profile, candidates, totalCandidates, loading, fetchCandidates,fetchProfile } =
    useCorporateContext();
  const [currentPage, setCurrentPage] = useState<number>(1);


  useEffect(()=>{
    fetchCandidates()
    fetchProfile()
  },[])

  const navigate = useNavigate();

  // Memoize total pages calculation
  const totalPages = useMemo(
    () => Math.ceil(totalCandidates / CANDIDATES_PER_PAGE) || 1,
    [totalCandidates]
  );

  // Dummy counts for now (replace with real data later)
  const stats = useMemo(
    () => ({
      bookmarked: profile ? profile.bookmarks.length : 0,
      wishlisted: 10, // Dummy
      contacted: 8, // Dummy
    }),
    [profile]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
        fetchCandidates(page);
      }
    },
    [totalPages, fetchCandidates, currentPage]
  );

  const handleFilterCandidates = useCallback(
    () => navigate("/corporate/filter-candidate"),
    [navigate]
  );
  const handleCandidateClick = useCallback(
    (id: string) => navigate(`/candidateProfile/${id}`),
    [navigate]
  );

  // Click handlers for cards
  const handleCardClick = useCallback(
    (type: string) => {
      console.log(`Clicked ${type} card`);
      if (type === "Bookmarked") {
        navigate("/corporate/bookmarked-candidates");
      }
      // Add navigation or filtering logic for other types if needed
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f2ef] to-[#e5e7eb] flex flex-col lg:flex-row antialiased">
      {profile && <ProfileSidebar profile={profile} />}
      <main className="flex-1 p-4 lg:p-6">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100"
        >
          <h1 className="text-2xl font-semibold text-[#0077b5]">
            Corporate Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Explore and manage top talent for your organization
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Bookmarked Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-[#0077b5] to-[#005885] text-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleCardClick("Bookmarked")}
          >
            <div className="flex items-center gap-4">
              <Bookmark className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">Bookmarked</p>
                <motion.p
                  key={stats.bookmarked}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold"
                >
                  {stats.bookmarked}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Wishlisted Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-[#e0245e] to-[#c01e4e] text-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleCardClick("Wishlisted")}
          >
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">Wishlisted</p>
                <motion.p
                  key={stats.wishlisted}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold"
                >
                  {stats.wishlisted}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Contacted Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-[#17bf63] to-[#139f50] text-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleCardClick("Contacted")}
          >
            <div className="flex items-center gap-4">
              <Mail className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">Contacted</p>
                <motion.p
                  key={stats.contacted}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold"
                >
                  {stats.contacted}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        <CandidateTable
          candidates={candidates}
          loading={loading}
          onFilter={handleFilterCandidates}
          onSelect={handleCandidateClick}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium mb-4 sm:mb-0 w-full sm:w-auto"
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm font-medium mb-4 sm:mb-0">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-md hover:bg-[#005885] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default memo(CorporateDashboard);
