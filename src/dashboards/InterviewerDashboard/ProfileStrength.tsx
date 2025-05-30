import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Star,
  DollarSign,
  AlertCircle,
  Plus,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useInterviewer } from "../../context/InterviewerContext";

const SectionIcon = memo(({ section }: { section: string }) => {
  const iconMap = {
    "Basic Information": <User className="w-4 h-4 text-primary" />,
    "Job Title": <Briefcase className="w-4 h-4 text-primary" />,
    Experience: <Star className="w-4 h-4 text-primary" />,
    Price: <DollarSign className="w-4 h-4 text-primary" />,
  };

  return iconMap[section] || <AlertCircle className="w-4 h-4 text-primary" />;
});

const ProgressPulse = memo(({ active }: { active: boolean }) => (
  <motion.span
    className="absolute inset-0 rounded-full bg-primary/20"
    animate={active ? { scale: [1, 1.2, 1] } : {}}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
));

const ProfileStrength: React.FC = () => {
  const navigate = useNavigate();
  const { completion, loading, error } = useInterviewer();

  const hasMissingSections =
    completion?.missingSections && completion.missingSections.length > 0;
  const showRemainingPercentage =
    completion && !completion.isComplete && completion.totalPercentage < 100;

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      navigate(`/edit-interviewer-profile#${sectionId}`);
    },
    [navigate]
  );

  if (loading.profile) {
    return (
      <div className="p-4 md:p-6 bg-white rounded-xl border border-gray-100 shadow-sm w-full max-w-md mx-auto flex justify-center items-center h-40">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="text-gray-600">Loading profile strength...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-white rounded-xl border border-gray-100 shadow-sm w-full max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!completion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm w-full max-w-md mx-auto"
    >
      {/* Header Section */}
      <div className="flex xs:flex-row items-start xs:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">
          Profile Strength
        </h3>

        <AnimatePresence mode="wait">
          <motion.span
            key={completion.isComplete ? "complete" : "incomplete"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`inline-flex items-center text-xs md:text-sm font-medium px-2.5 py-1 rounded-full ${
              completion.isComplete
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {completion.isComplete ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Complete
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                In Progress
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Progress Bar Section */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-sm md:text-base font-medium text-gray-700">
            {completion.totalPercentage}% Complete
          </span>
          {showRemainingPercentage && (
            <span className="text-xs md:text-sm font-medium text-primary">
              {100 - completion.totalPercentage}% remaining
            </span>
          )}
        </div>

        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <ProgressPulse active={!completion.isComplete} />
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion.totalPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Missing Sections */}
      {hasMissingSections && (
        <div className="space-y-4">
          <h4 className="text-sm md:text-base font-medium text-gray-700">
            Missing Sections
          </h4>
          <ul className="space-y-2.5">
            {completion.missingSections.map((section, index) => (
              <motion.li
                key={`${section.section}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                onClick={() =>
                  handleSectionClick(
                    section.section.toLowerCase().replace(/\s+/g, "-")
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <SectionIcon section={section.section} />
                  </div>
                  <span className="text-sm md:text-base font-medium text-gray-700">
                    {section.section}
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold text-primary whitespace-nowrap">
                  +{section.percentage}%
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Profile Section */}
      {!completion.isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-gray-100"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left flex-1">
              {hasMissingSections
                ? "Complete all sections to maximize your profile strength"
                : "Keep your profile updated for better opportunities"}
            </p>
            <Link
              to="/edit-interviewer-profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(ProfileStrength);
