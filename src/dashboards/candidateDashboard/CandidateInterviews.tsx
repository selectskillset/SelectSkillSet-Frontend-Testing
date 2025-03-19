import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Briefcase,
  DollarSign,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import profilePlaceholder from "../../images/interviewerProfile.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCandidateContext } from "../../context/CandidateContext";
import toast from "react-hot-toast";
import FindUserLoader from "../../components/ui/FindUserLoader";

const CandidateInterviews = () => {
  const { interviewers, isLoadingInterviewers, fetchInterviewers } =
    useCandidateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    experience: 3,
    rating: 4,
    availability: "available",
    priceRange: [50, 200],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFindingMatch, setIsFindingMatch] = useState(false);

  useEffect(() => {
    if (!interviewers.length && !isLoadingInterviewers) fetchInterviewers();
  }, [interviewers, isLoadingInterviewers, fetchInterviewers]);

  const filteredInterviewers = useMemo(() => {
    // Dummy filter logic for UI display purposes
    return interviewers;
  }, [interviewers]);

  const paginatedInterviewers = useMemo(
    () =>
      filteredInterviewers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredInterviewers, currentPage]
  );

  const totalPages = Math.ceil(filteredInterviewers.length / itemsPerPage);

  const handleFindPerfectMatch = async () => {
    setIsFindingMatch(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Found perfect matches!", {
        icon: "🎯",
      });
    } finally {
      setIsFindingMatch(false);
    }
  };

  if (isLoadingInterviewers) return <LoadingState />;
  if (isFindingMatch)
    return <FindUserLoader message="Finding perfect matches..." />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0077B5]">
            Interview Experts
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-[#0077B5] text-white rounded-lg shadow-sm"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-7xl mx-auto px-6 py-8">
        {/* Sidebar Filters */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto lg:block hidden"
        >
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-[#0077B5] mb-4">
                Advanced Filters
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0077B5] focus:outline-none"
                />
              </div>
            </div>

            <FilterSection title="Experience (years)">
              <input
                type="range"
                min="1"
                max="15"
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: +e.target.value })
                }
                className="w-full accent-[#0077B5]"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>8</span>
                <span>15+</span>
              </div>
            </FilterSection>

            <FilterSection title="Minimum Rating">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters({ ...filters, rating: +e.target.value })
                  }
                  className="w-full accent-[#0077B5]"
                />
                <span className="text-sm font-medium text-gray-600 flex">
                  {filters.rating}★
                </span>
              </div>
            </FilterSection>

            <FilterSection title="Hourly Rate ($)">
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [+e.target.value, filters.priceRange[1]],
                    })
                  }
                  className="w-1/2 p-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], +e.target.value],
                    })
                  }
                  className="w-1/2 p-2 border rounded-lg"
                />
              </div>
            </FilterSection>

            <FilterSection title="Availability">
              <select
                value={filters.availability}
                onChange={(e) =>
                  setFilters({ ...filters, availability: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0077B5]"
              >
                <option value="available">Available Now</option>
                <option value="24h">Within 24 Hours</option>
                <option value="week">Within 1 Week</option>
              </select>
            </FilterSection>

            <button
              onClick={handleFindPerfectMatch}
              className="w-full bg-gradient-to-r from-[#0077B5] to-[#004182] text-white py-2.5 rounded-lg
                        flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Sparkles size={18} />
              Find Perfect Match
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="space-y-8">
          <header className="bg-white p-6 rounded-xl shadow-sm">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Connect with Interview Experts
            </motion.h1>
            <p className="text-gray-600">
              {filteredInterviewers.length}+ professionals available
            </p>
          </header>

          <AnimatePresence mode="wait">
            {filteredInterviewers.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-1"
              >
                {paginatedInterviewers.map((interviewer) => (
                  <InterviewerCard
                    key={interviewer._id}
                    interviewer={interviewer}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-12 rounded-xl text-center shadow-sm"
              >
                <div className="text-gray-500 mb-4">🎯</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No experts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <MobileFilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClose={() => setIsSidebarOpen(false)}
            onFindMatch={handleFindPerfectMatch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    {children}
  </div>
);

const InterviewerCard = ({ interviewer }) => {
  const navigate = useNavigate();
  const isTopRated = interviewer.averageRating >= 4.5;

  return (
    <motion.article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={interviewer.profilePhoto || profilePlaceholder}
            alt={interviewer.firstName}
            className="w-20 h-20 rounded-xl object-cover border-2 border-[#0077B5]/20"
          />
          {isTopRated && (
            <div className="absolute -top-2 -right-2 bg-[#FFD700] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Star size={12} className="fill-white" />
              <span>Top Rated</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {interviewer.firstName} {interviewer.lastName}
              </h3>
              <p className="text-sm text-gray-600">{interviewer.jobTitle}</p>
            </div>
            <div className="flex items-center gap-1 text-[#FFD700]">
              <StarRating rating={interviewer.averageRating} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {interviewer.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#0077B5]/10 text-[#0077B5] rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-[#0077B5]" />
              <span>{interviewer.experience}+ years</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#0077B5]" />
              <span>${interviewer.price}/hr</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate(`/interviewer-profile/${interviewer._id}`)
              }
              className="px-4 py-2 text-sm bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition-colors"
            >
              View Profile
            </button>
            {/* <button className="px-4 py-2 text-sm bg-white border border-[#0077B5] text-[#0077B5] rounded-lg hover:bg-[#0077B5]/10 transition-colors">
              Schedule
            </button> */}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const StarRating = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Star key={index} size={16} className="fill-[#FFD700]" />
      ))}
      {hasHalfStar && <Star size={16} className="fill-[#FFD700]/50" />}
      {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map(
        (_, index) => (
          <Star
            key={index + fullStars + (hasHalfStar ? 1 : 0)}
            size={16}
            className="fill-gray-300"
          />
        )
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-[#0077B5] hover:bg-[#0077B5]/10 rounded-lg"
    >
      <ChevronLeft size={20} />
    </button>

    <div className="flex gap-1">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`w-8 h-8 rounded-lg text-sm ${
            currentPage === index + 1
              ? "bg-[#0077B5] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-[#0077B5] hover:bg-[#0077B5]/10 rounded-lg"
    >
      <ChevronRight size={20} />
    </button>
  </div>
);

const MobileFilterSidebar = ({ filters, setFilters, onClose, onFindMatch }) => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: 0 }}
    exit={{ x: "-100%" }}
    className="fixed inset-0 z-50 bg-white p-6"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold">Filters</h2>
      <button onClick={onClose} className="text-gray-500">
        <X size={24} />
      </button>
    </div>

    <div className="space-y-6">
      <FilterSection title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search experts..."
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </FilterSection>

      <FilterSection title="Experience (years)">
        <input
          type="range"
          min="1"
          max="15"
          value={filters.experience}
          onChange={(e) =>
            setFilters({ ...filters, experience: +e.target.value })
          }
          className="w-full accent-[#0077B5]"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>1</span>
          <span>15+</span>
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: +e.target.value })
            }
            className="w-full accent-[#FFD700]"
          />
          <span className="text-sm font-medium text-[#FFD700]">
            {filters.rating} ★
          </span>
        </div>
      </FilterSection>

      <FilterSection title="Hourly Rate ($)">
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [+e.target.value, filters.priceRange[1]],
              })
            }
            className="w-1/2 p-2 border rounded-lg"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], +e.target.value],
              })
            }
            className="w-1/2 p-2 border rounded-lg"
          />
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <select
          value={filters.availability}
          onChange={(e) =>
            setFilters({ ...filters, availability: e.target.value })
          }
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0077B5]"
        >
          <option value="available">Available Now</option>
          <option value="24h">Within 24 Hours</option>
          <option value="week">Within 1 Week</option>
        </select>
      </FilterSection>

      <button
        onClick={onFindMatch}
        className="w-full bg-[#0077B5] text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles size={18} />
        Find Perfect Match
      </button>
    </div>
  </motion.div>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse space-y-6 w-full max-w-3xl">
      <div className="h-8 bg-gray-200 rounded-full w-1/2 mx-auto" />
      <div className="h-4 bg-gray-200 rounded-full w-1/3 mx-auto" />
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default React.memo(CandidateInterviews);
