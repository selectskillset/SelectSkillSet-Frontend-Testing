import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCandidate } from "../../context/CandidateContext";
import CandidateStatistics from "./CandidateStatistics";
import axiosInstance from "../../components/common/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Star,
  Plus,
  CalendarDays,
  Award,
  RefreshCw,
} from "lucide-react";

// Interfaces
interface MissingSection {
  section: string;
  percentage: number;
}

interface CompletionData {
  totalPercentage: number;
  isComplete: boolean;
  missingSections: MissingSection[];
}

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  employmentType: string;
  totalExperience?: string;
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

// Utility Functions
const getCompanyLogoUrl = (companyName: string) => {
  const formattedName = companyName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

  return {
    clearbit: `https://logo.clearbit.com/${formattedName}.com`,
    initials: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      companyName.charAt(0)
    )}&size=48&backgroundType=gradientLinear&fontWeight=500`,
  };
};

// Memoized Components
const SectionIcon = memo(({ section }: { section: string }) => {
  const iconProps = {
    size: 20,
    className: "text-blue-600",
    "aria-hidden": "true",
  };

  const icon = useMemo(() => {
    if (section.includes("Basic")) return <User {...iconProps} />;
    if (section.includes("Resume")) return <FileText {...iconProps} />;
    if (section.includes("Work")) return <Briefcase {...iconProps} />;
    if (section.includes("Skills")) return <Star {...iconProps} />;
    return <AlertCircle {...iconProps} />;
  }, [section]);

  return icon;
});

const ActionCard = memo(
  ({ icon, title, description, link }: ActionCardProps) => (
    <Link
      to={link}
      className="group p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
);

const LoadingState = memo(() => (
  <div className="h-screen flex items-center justify-center" role="status">
    <RefreshCw className="animate-spin text-blue-600" size={32} />
    <span className="sr-only">Loading...</span>
  </div>
));

const ErrorState = memo(
  ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div
      className="h-screen flex flex-col items-center justify-center text-red-600 space-y-4"
      role="alert"
    >
      <div className="flex items-center">
        <AlertCircle size={24} className="mr-2" aria-hidden="true" />
        {error}
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
);

const CandidateDashboard: React.FC = () => {
  const { profile, loading, fetchProfile, error } = useCandidate();
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      await fetchProfile();
      const response = await axiosInstance.get("/candidate/profile-completion");
      setCompletion(response.data);
    } catch (error) {
      console.error("Error fetching completion data:", error);
      throw error;
    }
  }, [fetchProfile]);

  useEffect(() => {
    const abortController = new AbortController();

    fetchData().catch((error) => {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error in dashboard:", error);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchData, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  const renderProfileDetails = useCallback(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Profile Details
        </h3>
        <div className="space-y-3">
          {[
            { label: "Email", value: profile?.email || "Not provided" },
            { label: "Location", value: profile?.location || "Not provided" },
            { label: "Phone", value: profile?.phoneNumber || "Not provided" },
            {
              label: "LinkedIn",
              value: profile?.linkedIn ? (
                <a
                  href={profile.linkedIn}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              ) : (
                "Not provided"
              ),
            },
            {
              label: "Resume",
              value: profile?.resume ? (
                <a
                  href={profile.resume}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              ) : (
                "Not provided"
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="text-gray-800">{item.value}</span>
            </div>
          ))}

          {profile?.experiences?.length > 0 && (
            <div className="pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                Experience
              </h4>
              {profile.experiences.map((exp: Experience, idx) => {
                const logoUrls = getCompanyLogoUrl(exp.company);

                return (
                  <div
                    key={idx}
                    className="mb-4 pb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={logoUrls.clearbit}
                          alt={`${exp.company} logo`}
                          className="w-12 h-12 rounded-lg object-contain border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              logoUrls.initials;
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-gray-800 font-medium text-lg">
                              {exp.position}
                            </h5>
                            <p className="text-gray-700 font-medium">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {exp.location} ·{" "}
                              {exp.employmentType || "Full-time"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {exp.startDate} -{" "}
                              {exp.current ? "Present" : exp.endDate}
                            </p>
                            {exp.totalExperience && (
                              <p className="text-sm text-gray-500 mt-1">
                                {exp.totalExperience}
                              </p>
                            )}
                          </div>
                        </div>

                        {exp.description && (
                          <p className="mt-2 text-gray-600 text-sm">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    ),
    [profile]
  );

  const renderProfileCompletion = useCallback(
    () => (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Profile Strength</h3>
          <span className="text-blue-600 font-medium">
            {completion?.totalPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion?.totalPercentage}%` }}
            transition={{ duration: 1 }}
            role="progressbar"
            aria-valuenow={completion?.totalPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        {completion?.missingSections.slice(0, 3).map((section, index) => (
          <div key={index} className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <SectionIcon section={section.section} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {section.section}
                </p>
                <p className="text-xs text-gray-500">+{section.percentage}%</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/edit-candidate-profile")}
              className="p-1.5 hover:bg-gray-50 rounded-lg text-blue-600"
              aria-label={`Add ${section.section.toLowerCase()}`}
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
        ))}
        {completion?.missingSections.length > 3 && (
          <button
            className="w-full mt-4 text-blue-600 text-sm hover:bg-gray-50 py-2 rounded-lg"
            onClick={() => navigate("/edit-candidate-profile")}
          >
            View all {completion.missingSections.length} remaining sections
          </button>
        )}
      </motion.div>
    ),
    [completion, navigate]
  );

  if (loading?.profile) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={handleRetry} />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50"
        role="main"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-6 lg:sticky lg:top-6 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
            >
              <img
                src={profile?.profilePhoto || "/default-profile.png"}
                alt={`${profile?.name || "User"}'s profile`}
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("default-profile.png")) {
                    target.src = "/default-profile.png";
                  }
                }}
              />
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {profile?.name || "Unknown User"}
              </h2>
              <p className="text-gray-600 mt-1">
                {profile?.jobTitle || "No title provided"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {profile?.skills?.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {profile?.skills?.length > 6 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    +{profile.skills.length - 6} more
                  </span>
                )}
              </div>
            </motion.div>
            {renderProfileCompletion()}
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {renderProfileDetails()}
            <CandidateStatistics />
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionCard
                  icon={<CalendarDays size={24} className="text-orange-600" />}
                  title="Schedule Interviews"
                  description="Book mock interviews with experts"
                  link="/candidate-schedule-interviews"
                />
                <ActionCard
                  icon={<Award size={24} className="text-purple-600" />}
                  title="Skill Assessment"
                  description="Test your technical competencies"
                  link="/skill-assessment"
                />
              </div>
            </motion.div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(CandidateDashboard);
