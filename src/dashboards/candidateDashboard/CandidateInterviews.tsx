import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  BadgeCheck,
  CheckCircle,
} from "lucide-react";
import profilePlaceholder from "../../images/interviewerProfile.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCandidate } from "../../context/CandidateContext";
import { toast } from "sonner";
import FindUserLoader from "../../components/ui/FindUserLoader";

const CandidateInterviews = () => {
  const { interviewers, isLoadingInterviewers, fetchInterviewers } =
    useCandidate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    experience: 3,
    rating: 4,
    availability: "available",
    priceRange: [50, 200],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFindingMatch, setIsFindingMatch] = useState(false);

  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    if (!interviewers.length && !isLoadingInterviewers) {
      fetchInterviewers();
    }
  }, [interviewers, isLoadingInterviewers, fetchInterviewers]);

  const filteredInterviewers = useMemo(() => {
    return interviewers.filter((interviewer) => {
      const matchesSearch = `${interviewer.firstName} ${interviewer.lastName} ${
        interviewer.jobTitle
      } ${interviewer.skills.join(" ")}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesExperience = interviewer.experience >= filters.experience;
      const matchesRating = interviewer.averageRating >= filters.rating;
      const matchesPrice =
        interviewer.price >= filters.priceRange[0] &&
        interviewer.price <= filters.priceRange[1];

      return (
        matchesSearch && matchesExperience && matchesRating && matchesPrice
      );
    });
  }, [interviewers, searchQuery, filters]);

  const paginatedInterviewers = useMemo(() => {
    return filteredInterviewers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredInterviewers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInterviewers.length / itemsPerPage);

  const handleFindPerfectMatch = useCallback(async () => {
    setIsFindingMatch(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Found perfect matches!", { icon: "🎯" });
    } finally {
      setIsFindingMatch(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoadingInterviewers) return <LoadingState />;
  if (isFindingMatch)
    return <FindUserLoader message="Finding perfect matches..." />;

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Mobile Header */}
      <div className="lg:hidden p-4  shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Interview Experts</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-primary text-white rounded-lg shadow-sm"
            aria-label="Open filters"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Sidebar Filters */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-primary/5 rounded-xl p-6 shadow-sm sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto hidden lg:block"
        >
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
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
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
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
                className="w-full accent-primary"
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
                  className="w-full accent-secondary"
                />
                <span className="text-sm font-medium text-secondary flex">
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
                  className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
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
                  className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </FilterSection>

            <FilterSection title="Availability">
              <select
                value={filters.availability}
                onChange={(e) =>
                  setFilters({ ...filters, availability: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="available">Available Now</option>
                <option value="24h">Within 24 Hours</option>
                <option value="week">Within 1 Week</option>
              </select>
            </FilterSection>

            <button
              onClick={handleFindPerfectMatch}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2.5 rounded-lg
                        flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              aria-label="Find perfect match"
            >
              <Sparkles size={18} />
              Find Perfect Match
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-primary/5 p-6 rounded-xl shadow-sm"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connect with Interview Experts
            </h1>
            <p className="text-gray-600">
              {filteredInterviewers.length} professionals available
            </p>
          </motion.header>

          <AnimatePresence mode="wait">
            {filteredInterviewers.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-1"
              >
                {paginatedInterviewers.map((interviewer) => (
                  <InterviewerCard
                    key={interviewer._id}
                    interviewer={interviewer}
                    navigate={navigate}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-primary/5 p-12 rounded-xl text-center shadow-sm"
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
                onPageChange={handlePageChange}
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setIsSidebarOpen(false)}
            onFindMatch={handleFindPerfectMatch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    {children}
  </div>
);

const InterviewerCard = React.memo(
  ({ interviewer, navigate }: { interviewer: any; navigate: any }) => {
    const isTopRated = interviewer.averageRating >= 4.5;

    return (
      <motion.article
        whileHover={{ y: -2 }}
        className="bg-primary/5 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={interviewer.profilePhoto || profilePlaceholder}
              alt={`${interviewer.firstName} ${interviewer.lastName}`}
              className="w-20 h-20 rounded-xl object-cover border-2 border-primary/20"
              loading="lazy"
            />
            {interviewer.isVerified && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-primary text-white p-1 rounded-full">
                  <BadgeCheck size={20} />
                </div>
              </div>
            )}
            {isTopRated && (
              <div className="absolute -bottom-1 -right-1 bg-secondary text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
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
              <div className="flex items-center gap-1">
                <StarRating rating={interviewer.averageRating} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {interviewer.skills
                .slice(0, 4)
                .map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/5 text-primary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <span>
                  {interviewer.experience
                    ? `${interviewer.experience.split(" ")[0]}+ years`
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                <span>${interviewer.price}/hr</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate(`/interviewer-profile/${interviewer._id}`)
                }
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }
);

const StarRating = React.memo(({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={16}
          className="fill-secondary text-secondary"
        />
      ))}
      {hasHalfStar && (
        <Star
          key="half"
          size={16}
          className="fill-secondary/50 text-secondary"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={16}
          className="fill-gray-300 text-gray-300"
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
});

const Pagination = React.memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const pages = useMemo(() => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage <= 3) {
        return [1, 2, 3, 4, "...", totalPages];
      }

      if (currentPage >= totalPages - 2) {
        return [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      }

      return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }, [currentPage, totalPages]);

    return (
      <div className="flex items-center justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-primary hover:bg-primary/5 rounded-lg"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" ? onPageChange(page) : null
              }
              className={`w-8 h-8 rounded-lg text-sm ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              } ${typeof page !== "number" ? "pointer-events-none" : ""}`}
              disabled={typeof page !== "number"}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 disabled:opacity-50 disabled:cursor-not-allowed text-primary hover:bg-primary/5 rounded-lg"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }
);

const MobileFilterSidebar = React.memo(
  ({
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    onClose,
    onFindMatch,
  }: {
    filters: any;
    setFilters: any;
    searchQuery: string;
    setSearchQuery: any;
    onClose: () => void;
    onFindMatch: () => void;
  }) => {
    return (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween" }}
        className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-primary">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <FilterSection title="Search">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
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
              className="w-full accent-primary"
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
                className="w-full accent-secondary"
              />
              <span className="text-sm font-medium text-secondary">
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
                className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
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
                className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </FilterSection>

          <FilterSection title="Availability">
            <select
              value={filters.availability}
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="available">Available Now</option>
              <option value="24h">Within 24 Hours</option>
              <option value="week">Within 1 Week</option>
            </select>
          </FilterSection>

          <button
            onClick={onFindMatch}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2.5 rounded-lg
                    flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <Sparkles size={18} />
            Find Perfect Match
          </button>
        </div>
      </motion.div>
    );
  }
);

const LoadingState = React.memo(() => {
  return (
    <div className="min-h-screen bg-primary/5 p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Skeleton Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6 h-[calc(100vh-3rem)] hidden lg:block">
          <div className="space-y-6 animate-pulse">
            <div className="border-b border-gray-200 pb-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded-lg" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
            <div className="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Skeleton Main Content */}
        <main className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-gray-200" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 bg-gray-200 rounded-full w-16"
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 bg-gray-200 rounded-lg w-24" />
                      <div className="h-8 bg-gray-200 rounded-lg w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
});

export default React.memo(CandidateInterviews);
