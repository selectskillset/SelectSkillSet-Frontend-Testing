// CandidateDashboard.tsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useCandidate } from "../../context/CandidateContext";
import CandidateProfile from "./CandidateProfile";
import { RefreshCw } from "lucide-react";

const LoadingState = memo(() => (
  <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="animate-spin text-primary w-8 h-8" />
      <span className="text-gray-600">Loading your dashboard...</span>
    </div>
  </div>
));

const CandidateDashboard: React.FC = () => {
  const { profile, loading, completion } = useCandidate();

  if (loading.profile) return <LoadingState />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CandidateProfile profile={profile} completion={completion} />
      </motion.div>
    </div>
  );
};

export default memo(CandidateDashboard);