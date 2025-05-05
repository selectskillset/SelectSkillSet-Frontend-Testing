import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  User,
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type MissingSection = {
  section: string;
  percentage: number;
};

export type CompletionData = {
  totalPercentage: number;
  isComplete: boolean;
  missingSections: MissingSection[];
};

const SectionIcon = memo(({ section }: { section: string }) => {
  const iconMap = {
    "Basic Information": <User className="w-4 h-4 text-primary" />,
    Resume: <FileText className="w-4 h-4 text-primary" />,
    "Work Experience": <Briefcase className="w-4 h-4 text-primary" />,
    Skills: <Star className="w-4 h-4 text-primary" />,
  };

  return iconMap[section] || <AlertCircle className="w-4 h-4 text-primary" />;
});

const ProgressPulse = () => (
  <motion.span
    className="absolute inset-0 rounded-full bg-primary/20"
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

const ProfileStrength: React.FC<{ completion: CompletionData | null }> = ({
  completion,
}) => {
  if (!completion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6  bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Profile Completion
        </h3>
        <AnimatePresence mode="wait">
          <motion.span
            key={completion.isComplete ? "complete" : "incomplete"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`inline-flex items-center text-xs font-medium px-2  py-1 rounded-full ${
              completion.isComplete
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {completion.isComplete ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                In Progress
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progress: {completion.totalPercentage}%
          </span>
          <span className="text-xs font-medium text-primary">
            {100 - completion.totalPercentage}% remaining
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <ProgressPulse />
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion.totalPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Missing Sections</h4>
        <ul className="space-y-3">
          {completion.missingSections.map((section, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <SectionIcon section={section.section} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {section.section}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                +{section.percentage}%
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {completion.totalPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-gray-100"
        >
          <p className="text-xs text-gray-500 text-center">
            Complete all sections to maximize your profile strength
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(ProfileStrength);
