import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Search,
  Star,
  MapPin,
} from "lucide-react";
import { useCorporate } from "../../context/CorporateContext";
import { useNavigate } from "react-router-dom";

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
  jobTitle?: string;
  statistics: { averageRating: number };
}

const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow border border-gray-200 p-6"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="h-8 bg-gray-200 rounded-lg w-24" />
        </div>
      </motion.div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
      <User className="text-blue-500 w-12 h-12" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mt-4">No Candidates Found</h3>
    <p className="text-gray-500 mt-1 max-w-md mx-auto">
      Try adjusting your search criteria or check back later for new candidates.
    </p>
  </motion.div>
);

const CandidatesList: React.FC = () => {
  const { candidates, fetchCandidates } = useCorporate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchCandidates(page);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, fetchCandidates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return candidates.filter((c) =>
      c.skills.some((s) => s.toLowerCase().includes(term)) ||
      c.jobTitle?.toLowerCase().includes(term) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(term)
    );
  }, [candidates, searchTerm]);

  const handleViewProfile = (id: string) => navigate(`/candidateProfile/${id}`);

  return (
    <div className="container mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Discover Talent</h1>
          <p className="text-gray-600">Explore our network of professional candidates</p>
        </header>

        <div className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name, skills, or role"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Showing <strong>{filteredCandidates.length}</strong> of <strong>{candidates.length}</strong> candidates
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : filteredCandidates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCandidates.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ scale: 1.015 }}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all"
                >
                  <div className="p-5">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-14 h-14">
                        <img
                          src={c.profilePhoto || "/default-profile.png"}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-profile.png";
                          }}
                          alt={`${c.firstName} ${c.lastName}`}
                          className="w-full h-full object-cover rounded-md border"
                        />
                        {c.statistics.averageRating >= 4.5 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow">
                            <Star className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-base font-semibold text-gray-800 truncate">
                          {c.firstName} {c.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{c.jobTitle || "N/A"}</p>
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{c.location || "N/A"}</span>
                        </div>
                        <StarRating rating={c.statistics.averageRating} />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 text-primary text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {c.skills.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        onClick={() => handleViewProfile(c._id)}
                        className="text-sm text-primary hover:text-primary font-medium transition underline"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const StarRating = React.memo(({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center mt-1 text-yellow-500">
      {[...Array(full)].map((_, i) => (
        <Star key={`f-${i}`} className="w-3 h-3 fill-yellow-400" />
      ))}
      {half && <Star key="half" className="w-3 h-3 fill-yellow-300" />}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e-${i}`} className="w-3 h-3 text-gray-300" />
      ))}
      <span className="ml-1 text-xs text-gray-600">{rating > 0 ? rating.toFixed(1) : "-"}</span>
    </div>
  );
});

export default React.memo(CandidatesList);
