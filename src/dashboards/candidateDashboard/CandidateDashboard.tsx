import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCandidate } from "../../context/CandidateContext";
import CandidateSidebar from "./CandidateSidebar";
import CandidateProfile from "./CandidateProfile";
import CandidateStatistics from "./CandidateStatistics";

import { RefreshCw, Menu, AlertCircle } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import axiosInstance from "../../components/common/axiosConfig";
import CandidateInterviews from "./CandidateInterviews";
import CandidateUpcomingInterviews from "./CandidateUpcomingInterviews";

const LoadingState = memo(() => (
  <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="animate-spin text-primary w-8 h-8" />
      <span className="text-gray-600">Loading your dashboard...</span>
    </div>
  </div>
));

const CandidateDashboard: React.FC = () => {
  const { profile, loading, fetchProfile, error } = useCandidate();
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const isSmallScreen = useMediaQuery({ maxWidth: 1023 });

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
    fetchData().catch(console.error);
    return () => abortController.abort();
  }, [fetchData, retryCount]);

  useEffect(() => {
    if (isLargeScreen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarExpanded(false);
    } else {
      setIsSidebarExpanded(true);
    }
  }, [isSmallScreen]);


  const toggleSidebar = () => {
    if (isSmallScreen) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  const renderActiveTab = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <CandidateProfile profile={profile} completion={completion} />;
      case "schedule":
        return <CandidateInterviews />;
      case "upcoming":
        return <CandidateUpcomingInterviews />;
      case "statistics":
        return <CandidateStatistics />;
      default:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
              Welcome back! Here's your interview activity summary.
            </p>
          </div>
        );
    }
  }, [activeTab, profile, completion]);

  if (loading?.profile) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-20 left-0 right-0 bg-white p-4 flex justify-between items-center z-40 shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {activeTab === "dashboard" && "Dashboard"}
          {activeTab === "profile" && "Profile"}
          {activeTab === "schedule" && "Schedule Interview"}
          {activeTab === "upcoming" && "Upcoming Interviews"}
          {activeTab === "statistics" && "Interview Statistics"}
        </h1>
        <div className="w-5 h-5"></div>
      </header>

      <div className="flex pt-16 lg:pt-0 flex-1">
        <CandidateSidebar
          activeTab={activeTab}
          isMobileSidebarOpen={isMobileSidebarOpen}
          isSidebarExpanded={isSidebarExpanded}
          isSidebarHovered={isSidebarHovered}
          onTabChange={setActiveTab}
          onToggleSidebar={toggleSidebar}
          onSidebarHover={setIsSidebarHovered}
          onMobileSidebarClose={() => setIsMobileSidebarOpen(false)}
          completion={completion}
        />

        <main className={`flex-1 p-4 sm:p-6 transition-all duration-300`}>
          <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "profile" && "My Profile"}
            {activeTab === "schedule" && "Schedule New Interview"}
            {activeTab === "upcoming" && "Your Upcoming Interviews"}
            {activeTab === "statistics" && "Interview Statistics"}
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveTab}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default memo(CandidateDashboard);
