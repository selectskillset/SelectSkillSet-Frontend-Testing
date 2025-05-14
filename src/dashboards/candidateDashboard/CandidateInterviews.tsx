import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  Briefcase,
  Euro,
  Star,
  X,
  Sparkles,
  BadgeCheck,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import profilePlaceholder from "../../images/interviewerProfile.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCandidate } from "../../context/CandidateContext";
import { toast } from "sonner";
import FindUserLoader from "../../components/ui/FindUserLoader";
import { Tooltip } from "react-tooltip";

interface Interviewer {
  _id: string;
  firstName: string;
  lastName: string;
  experience: string;
  price: string;
  profilePhoto: string;
  jobTitle: string;
  location: string;
  summary: string;
  isVerified: boolean;
  skills: string[];
  completedInterviews: number;
  averageRating: number;
  availability?: {
    dates: { date: string }[];
  };
}

const CandidateInterviews = () => {
  const { interviewers, isLoadingInterviewers, fetchInterviewers } =
    useCandidate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    experience: 0,
    rating: 0,
    availability: "all",
    priceRange: [0, 500],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    if (!interviewers.length && !isLoadingInterviewers) {
      fetchInterviewers();
    }
  }, [interviewers, isLoadingInterviewers, fetchInterviewers]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const toggleChipSelection = useCallback((chipKey: string) => {
    setSelectedChips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chipKey)) {
        newSet.delete(chipKey);
      } else {
        newSet.add(chipKey);
      }
      return newSet;
    });
  }, []);

  const lastClicks = useRef<Record<string, number>>({});

  const handleChipClick = useCallback(
    (chipKey: string, action: () => void) => {
      const now = Date.now();
      const lastClick = lastClicks.current[chipKey] || 0;

      if (now - lastClick < 300) {
        toggleChipSelection(chipKey);
      } else {
        action();
      }

      lastClicks.current[chipKey] = now;
    },
    [toggleChipSelection]
  );

  const filteredInterviewers = useMemo(() => {
    return interviewers
      .filter((interviewer: Interviewer) => {
        const matchesSearch =
          searchQuery === "" ||
          `${interviewer.firstName} ${interviewer.lastName} ${
            interviewer.jobTitle
          } ${interviewer.skills.join(" ")} ${interviewer.location}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const expMatch = interviewer.experience.match(/\d+/);
        const expYears = expMatch ? parseInt(expMatch[0]) : 0;
        const matchesExperience = expYears >= filters.experience;

        const matchesRating = interviewer.averageRating >= filters.rating;

        const price = parseInt(interviewer.price) || 0;
        const matchesPrice =
          price >= filters.priceRange[0] && price <= filters.priceRange[1];

        const matchesAvailability =
          filters.availability === "all" ||
          interviewer.availability === filters.availability;

        const matchesSelectedChips =
          selectedChips.size === 0 ||
          Array.from(selectedChips).some((chipKey) => {
            switch (chipKey) {
              case "available":
                return interviewer.availability === "available";
              case "topRated":
                return interviewer.averageRating >= 4.5;
              case "experienced":
                return expYears >= 10;
              case "affordable":
                return price <= 20;
              default:
                return true;
            }
          });

        return (
          matchesSearch &&
          matchesExperience &&
          matchesRating &&
          matchesPrice &&
          matchesAvailability &&
          matchesSelectedChips
        );
      })
      .sort((a, b) => b.averageRating - a.averageRating);
  }, [interviewers, searchQuery, filters, selectedChips]);

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
      setFilters({
        experience: 3,
        rating: 4.5,
        availability: "available",
        priceRange: [50, 150],
      });
    } finally {
      setIsFindingMatch(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setActiveFilter(filterType);
    setTimeout(() => setActiveFilter(null), 1500);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      experience: 0,
      rating: 0,
      availability: "all",
      priceRange: [0, 500],
    });
    setSearchQuery("");
    setSelectedChips(new Set());
    toast.success("Filters cleared");
  }, []);

  const filterChips = [
    {
      key: "topRated",
      label: "Top Rated",
      active: filters.rating >= 4.5,
      onClick: () =>
        handleFilterChange("rating", filters.rating >= 4.5 ? 0 : 4.5),
      icon: <Star size={14} className="fill-yellow-400 text-yellow-400" />,
      tooltip: "Show only top-rated professionals with 4.5+ star ratings",
    },
    {
      key: "experienced",
      label: "10+ Years",
      active: filters.experience >= 10,
      onClick: () =>
        handleFilterChange("experience", filters.experience >= 10 ? 0 : 10),
      icon: <Briefcase size={14} className="text-blue-500" />,
      tooltip: "Filter for highly experienced professionals (10+ years in field)",
    },
    {
      key: "affordable",
      label: "Under €20",
      active: filters.priceRange[1] <= 20,
      onClick: () =>
        handleFilterChange(
          "priceRange",
          filters.priceRange[1] <= 20 ? [0, 500] : [0, 20]
        ),
      icon: <Euro size={14} className="text-green-500" />,
      tooltip: "Display only budget-friendly options (€20/hour or less)",
    },
  ];

  if (isLoadingInterviewers) return <LoadingState />;
  if (isFindingMatch)
    return <FindUserLoader message="Finding perfect matches..." />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="w-[92vw] lg:w-full mx-auto px-4 sm:px-5 lg:px-6 py-5">

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Connect with Industry Experts
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                {filteredInterviewers.length}{" "}
                {filteredInterviewers.length === 1
                  ? "professional"
                  : "professionals"}{" "}
                available
                {Object.values(filters).some((val) =>
                  Array.isArray(val)
                    ? val[0] !== 0 || val[1] !== 500
                    : val !== 0 && val !== "all"
                ) && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-sm text-primary hover:underline"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Reset all filters to their default values"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>

            <div className="relative w-full md:w-72 lg:w-80 flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content="Search by name, job title, skills, or location"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                data-tooltip-id="global-tooltip"
                data-tooltip-content="Execute search with current filters"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto filter-chips pb-2 scrollbar-hide">
            <div className="flex gap-2 w-max">
              {filterChips.map((chip) => (
                <motion.button
                  key={chip.key}
                  onClick={() => handleChipClick(chip.key, chip.onClick)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    chip.active || selectedChips.has(chip.key)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={chip.tooltip}
                >
                  {chip.icon}
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.header>

        <main className="space-y-5">
          <AnimatePresence mode="wait">
            {filteredInterviewers.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2"
              >
                {paginatedInterviewers.map((interviewer: Interviewer) => (
                  <InterviewerCard
                    key={interviewer._id}
                    interviewer={interviewer}
                    navigate={navigate}
                    activeFilter={activeFilter}
                    filters={filters}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 md:p-8 rounded-xl text-center shadow-sm border border-gray-100"
              >
                <div className="text-primary text-4xl mb-3">🔍</div>
                <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
                  No experts found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4 md:mb-5 text-sm md:text-base">
                  Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-4 md:px-5 py-2 text-sm md:text-base bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Reset all search filters to their default values"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                  <button
                    onClick={handleFindPerfectMatch}
                    className="px-4 md:px-5 py-2 text-sm md:text-base bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Our algorithm will find the best matching professionals based on your profile"
                  >
                    <Sparkles size={16} />
                    Find Matches
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const InterviewerCard = React.memo(
  ({
    interviewer,
    navigate,
    activeFilter,
    filters,
  }: {
    interviewer: Interviewer;
    navigate: any;
    activeFilter: string | null;
    filters: any;
  }) => {
    const expMatch = interviewer.experience.match(/\d+/);
    const expYears = expMatch ? parseInt(expMatch[0]) : 0;
    const price = parseInt(interviewer.price) || 0;
    const isTopRated = interviewer.averageRating >= 4.5;

    const getHighlightClass = () => {
      if (!activeFilter) return "";

      if (activeFilter === "experience" && expYears >= filters.experience) {
        return "ring-2 ring-blue-500 ring-offset-2";
      }
      if (
        activeFilter === "rating" &&
        interviewer.averageRating >= filters.rating
      ) {
        return "ring-2 ring-yellow-500 ring-offset-2";
      }
      if (
        activeFilter === "priceRange" &&
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1]
      ) {
        return "ring-2 ring-green-500 ring-offset-2";
      }
      if (
        activeFilter === "availability" &&
        interviewer.availability === filters.availability
      ) {
        return "ring-2 ring-purple-500 ring-offset-2";
      }

      return "";
    };

    return (
      <motion.article
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 ${getHighlightClass()}`}
      >
        <div className="flex justify-end mb-2">
          {isTopRated && (
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white w-24 rounded-sm absolute text-[12px] font-medium flex items-center justify-center gap-1"
              data-tooltip-id="global-tooltip"
              data-tooltip-content="This professional is in the top 10% of rated interviewers"
            >
              <Star size={10} className="fill-white" />
              <span>Top Rated</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={interviewer.profilePhoto || profilePlaceholder}
                alt={`${interviewer.firstName} ${interviewer.lastName}`}
                className="w-14 h-14 rounded-lg object-cover border-2 border-primary/20"
                loading="lazy"
                data-tooltip-id="global-tooltip"
                data-tooltip-content={`${interviewer.firstName}'s profile picture`}
              />
              {interviewer.isVerified && (
                <div className="absolute -top-2 -right-2">
                  <div 
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Verified professional - Identity and credentials confirmed by SelectSkillset"
                  >
                    <BadgeCheck
                      className="text-primary bg-white rounded-full"
                      size={25}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="truncate">
                  <h3 
                    className="text-base font-semibold text-gray-900 truncate"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={`${interviewer.firstName} ${interviewer.lastName}`}
                  >
                    {interviewer.firstName} {interviewer.lastName}
                  </h3>
                  <p 
                    className="text-xs text-gray-600 truncate"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={`Current role: ${interviewer.jobTitle}`}
                  >
                    {interviewer.jobTitle}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="text-primary" />
                    <span
                      data-tooltip-id="global-tooltip"
                      data-tooltip-content={`Based in ${interviewer.location}`}
                    >
                      {interviewer.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <StarRating rating={interviewer.averageRating} />
                </div>
              </div>

              <div className="mt-2">
                <p 
                  className="text-xs text-gray-600 line-clamp-2"
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={interviewer.summary}
                >
                  {interviewer.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {interviewer.skills
                  .slice(0, 3)
                  .map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/5 text-primary rounded-full text-xs font-medium"
                      data-tooltip-id="global-tooltip"
                      data-tooltip-content={`Specialized in ${skill}`}
                    >
                      {skill}
                    </span>
                  ))}
                {interviewer.skills.length > 3 && (
                  <span
                    className="px-1.5 py-1 text-gray-500 rounded-full text-xs"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={`Additional skills: ${interviewer.skills.slice(3).join(", ")}`}
                  >
                    +{interviewer.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <Briefcase size={12} className="text-primary" />
              <span 
                data-tooltip-id="global-tooltip"
                data-tooltip-content={`${expYears} years of professional experience in this field`}
              >
                {expYears} years
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Euro size={12} className="text-primary" />
              <span 
                data-tooltip-id="global-tooltip"
                data-tooltip-content={`Standard rate: €${price} per hour`}
              >
                {price}/hr
              </span>
            </div>

            {interviewer.availability?.dates.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 col-span-2">
                <Clock size={14} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  Available on:
                </span>
                <div className="flex flex-wrap gap-2">
                  {interviewer.availability.dates
                    .slice(0, 2)
                    .map((slot, index) => {
                      const formattedDate = new Date(
                        slot.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                          data-tooltip-id="global-tooltip"
                          data-tooltip-content={`Available for interview on ${formattedDate}`}
                        >
                          {formattedDate}
                        </span>
                      );
                    })}
                  {interviewer.availability.dates.length > 2 && (
                    <span
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      data-tooltip-id="global-tooltip"
                      data-tooltip-content={`Also available on: ${interviewer.availability.dates
                        .slice(2)
                        .map(d => new Date(d.date).toLocaleDateString())
                        .join(", ")}`}
                    >
                      +{interviewer.availability.dates.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() =>
                navigate(`/interviewer-profile/${interviewer._id}`)
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              data-tooltip-id="global-tooltip"
              data-tooltip-content="View complete profile, reviews, and book an interview"
            >
              View Profile
            </button>
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
    <div 
      className="flex items-center"
      data-tooltip-id="global-tooltip"
      data-tooltip-content={`Average rating: ${rating.toFixed(1)}/5 (based on multiple interviews)`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={12}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <Star
          key="half"
          size={12}
          className="fill-yellow-400/50 text-yellow-400"
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={12}
          className="fill-gray-300 text-gray-300"
        />
      ))}
      <span className="ml-1 text-[10px] text-gray-600">
        {rating > 0 ? rating.toFixed(1) : "-"}
      </span>
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
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1 md:p-2 disabled:opacity-50 disabled:cursor-not-allowed text-primary hover:bg-primary/5 rounded-lg flex items-center gap-1"
          aria-label="Previous page"
          data-tooltip-id="global-tooltip"
          data-tooltip-content="Navigate to previous page of results"
        >
          <ChevronLeft size={16} />
          <span className="sr-only md:not-sr-only text-sm">Previous</span>
        </button>

        <div className="flex gap-1">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() =>
                typeof page === "number" ? onPageChange(page) : null
              }
              className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs md:text-sm flex items-center justify-center transition-colors ${
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              } ${typeof page !== "number" ? "pointer-events-none" : ""}`}
              disabled={typeof page !== "number"}
              data-tooltip-id={typeof page === "number" ? "global-tooltip" : undefined}
              data-tooltip-content={typeof page === "number" ? `Go to page ${page}` : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1 md:p-2 disabled:opacity-50 disabled:cursor-not-allowed text-primary hover:bg-primary/5 rounded-lg flex items-center gap-1"
          aria-label="Next page"
          data-tooltip-id="global-tooltip"
          data-tooltip-content="Navigate to next page of results"
        >
          <span className="sr-only md:not-sr-only text-sm">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }
);

const LoadingState = React.memo(() => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="">
        <div className="mb-6 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-48 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-36 mb-4"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-1.5">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="mt-4">
                  <div className="h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default React.memo(CandidateInterviews);