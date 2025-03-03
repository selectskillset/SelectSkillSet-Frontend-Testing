import React, { useCallback, memo, useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  Bookmark,
  Star,
  Mail,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
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

const CANDIDATES_PER_PAGE = 8;
const CARD_ANIMATION_DURATION = 0.3;

// Profile Sidebar Component
const ProfileSidebar = memo(({ profile }: { profile: CorporateProfile }) => {
  const navigate = useNavigate();
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: CARD_ANIMATION_DURATION }}
      className="bg-white shadow-xl rounded-2xl h-max p-6 lg:w-80 m-4 md:sticky top-24 border border-gray-100/70 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div whileHover={{ scale: 1.05 }} className="relative group">
          <img
            src={profile.profilePhoto || "/corporate-avatar.png"}
            alt={`${profile.companyName} profile`}
            className="w-24 h-24 rounded-2xl mb-2 border-2 border-[#006097] object-cover shadow-lg transition-all duration-300 ease-in-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#006097]/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#006097]">
            {profile.companyName}
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            {profile.contactName}
          </p>
        </div>

        <div className="w-full space-y-4 text-sm mt-6 border-t border-gray-100 pt-4">
          {[
            { icon: Mail, label: "Email", value: profile.email },

            {
              label: "Phone",
              value: `${profile.countryCode} ${profile.phoneNumber}`,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-600">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-[#006097] font-medium truncate max-w-[160px]">
                {item.value}
              </span>
            </motion.div>
          ))}
          <button
            onClick={() => navigate("/corporate-bookmarked")}
            className="w-full  text-white py-2 rounded-lg bg-[#005f8a] transition-colors"
          >
            <Bookmark size={16} className="inline mr-2" />
            View Bookmarks ({profile.bookmarks.length})
          </button>
        </div>
      </div>
    </motion.aside>
  );
});

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: CARD_ANIMATION_DURATION, delay: 0.2 }}
      className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100/70 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Candidate Directory
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFilter}
          className="flex items-center gap-2 bg-[#006097] text-white px-5 py-3 rounded-xl hover:bg-[#004875] transition-all duration-200 font-medium shadow-md"
        >
          <Filter size={18} />
          Advanced Filters
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-16 bg-gradient-to-r from-gray-50/50 via-gray-100/50 to-gray-50/50 rounded-xl animate-pulse"
              />
            ))}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Profile", "Name", "Skills", "Location", "Rating"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {candidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 last:border-b-0 cursor-pointer"
                    onClick={() => onSelect(candidate._id)}
                  >
                    <td className="py-4 px-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-md overflow-hidden"
                      >
                        <img
                          src={
                            candidate.profilePhoto || "/candidate-avatar.png"
                          }
                          alt={`${candidate.firstName} ${candidate.lastName}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {`${candidate.firstName} ${candidate.lastName}`}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.length > 2 ? (
                          <>
                            {/* Display first 3 skills */}
                            {candidate.skills.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                            {/* Display "+ X others" for remaining skills */}
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                              + {candidate.skills.length - 2} others
                            </span>
                          </>
                        ) : (
                          // Display all skills if there are 3 or fewer
                          candidate.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {candidate.location || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(candidate.statistics.averageRating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-800">
                          {candidate.statistics.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
);

// Main Component
const CorporateDashboard: React.FC = () => {
  const {
    profile,
    candidates,
    totalCandidates,
    loading,
    fetchCandidates,
    fetchProfile,
  } = useCorporateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
    fetchProfile();
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(totalCandidates / CANDIDATES_PER_PAGE),
    [totalCandidates]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        fetchCandidates(page);
      }
    },
    [totalPages, fetchCandidates]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30 flex flex-col lg:flex-row antialiased">
      {profile && <ProfileSidebar profile={profile} />}

      <main className="flex-1 p-4 lg:p-6 lg:pr-8">
        {/* Main Content */}
        <CandidateTable
          candidates={candidates}
          loading={loading}
          onFilter={() => navigate("/corporate/filter-candidate")}
          onSelect={(id) => navigate(`/candidateProfile/${id}`)}
        />

        {/* Pagination Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
            Previous
          </motion.button>

          <span className="text-gray-600 font-medium">
            Page <span className="text-[#006097]">{currentPage}</span> of{" "}
            {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Next
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default memo(CorporateDashboard);
