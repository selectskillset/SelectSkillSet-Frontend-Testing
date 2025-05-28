import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  ChevronDown,
  X,
  User,
  Settings,
  Menu,
  BarChart2,
  Edit,
} from "lucide-react";
import { useCandidate } from "../../context/CandidateContext";
import ProfileStrength from "./ProfileStrength";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  isExpanded?: boolean;
}

const SidebarItem = memo(
  ({
    icon,
    label,
    isActive,
    onClick,
    hasSubmenu = false,
    isSubmenuOpen = false,
    isExpanded = true,
  }: SidebarItemProps) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium shadow-sm"
          : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-800"
      } ${!isExpanded ? "justify-center px-2" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-lg transition-colors ${
          isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </span>
      {isExpanded && (
        <>
          <span className="text-sm font-medium text-left flex-1 truncate">
            {label}
          </span>
          {hasSubmenu && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isSubmenuOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </>
      )}
    </motion.button>
  )
);

interface NavItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
  hasSubmenu?: boolean;
  subItems?: { key: string; label: string }[];
}

const navItems: NavItem[] = [
  {
    key: "dashboard",
    path: "/candidate-dashboard",
    icon: <Home size={18} />,
    label: "Dashboard",
  },
  {
    key: "schedule",
    path: "/candidate-schedule-interviews",
    icon: <Calendar size={18} />,
    label: "Schedule Interview",
  },
  {
    key: "upcoming",
    path: "/candidate-interviews",
    icon: <Clock size={18} />,
    label: "Upcoming Interviews",
  },
  {
    key: "statistics",
    path: "/candidate-statestics",
    icon: <BarChart2 size={18} />,
    label: "Interview Statistics",
  },
  {
    key: "settings",
    path: "/candidate-settings",
    icon: <Settings size={18} />,
    label: "Settings",
  },
];

const CandidateLayout: React.FC = () => {
  const { completion } = useCandidate();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isSmallScreen = useMediaQuery({ maxWidth: 1023 });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isSmallScreen);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleTabClick = useCallback(
    (path: string) => {
      navigate(path);
      if (isSmallScreen) {
        setIsMobileSidebarOpen(false);
      }
    },
    [navigate, isSmallScreen]
  );

  const toggleSidebar = useCallback(() => {
    if (isSmallScreen) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarExpanded((prev) => !prev);
    }
  }, [isSmallScreen]);

  const sidebarWidth = isSidebarExpanded || isSidebarHovered ? "w-72" : "w-20";

  // Update sidebar state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSmallScreen]);

  const currentPageTitle =
    navItems.find((item) => location.pathname.startsWith(item.path))?.label ||
    "";

  const getCurrentTabHeading = useCallback(() => {
    const currentItem = navItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    if (currentItem) {
      switch (currentItem.key) {
        case "dashboard":
          return "Dashboard Overview";
        case "schedule":
          return "Schedule New Interview";
        case "upcoming":
          return "Your Upcoming Interviews";
        case "statistics":
          return "Interview Statistics";
        case "settings":
          return "Settings";
        default:
          return "";
      }
    }
    return "";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden top-20 left-0 right-0 bg-white p-4 flex justify-between items-center z-40 shadow-sm border-b border-gray-100"
      >
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {currentPageTitle}
        </h1>
        <div className="w-5 h-5" /> {/* Spacer for alignment */}
      </motion.header>

      <div className="flex pt-8 lg:pt-0 flex-1">
        {/* Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          ref={sidebarRef}
          initial={false}
          animate={{
            width: isMobileSidebarOpen ? "20rem" : sidebarWidth,
            left: isMobileSidebarOpen ? "0" : isSmallScreen ? "-20rem" : "0",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            bounce: 0.1,
          }}
          className={`fixed w-[20%] lg:relative top-0 h-full lg:h-auto bg-white/95 backdrop-blur-sm border-r border-gray-200/50 z-50 lg:z-30 flex flex-col overflow-hidden ${
            isMobileSidebarOpen ? "shadow-2xl" : "shadow-sm"
          }`}
          onMouseEnter={() => !isSidebarExpanded && setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/50">
            <motion.div
              animate={{
                opacity:
                  isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen
                    ? 1
                    : 0,
                x:
                  isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen
                    ? 0
                    : -20,
              }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 ${
                !(isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen)
                  ? "hidden"
                  : ""
              }`}
            >
              <span className="font-semibold text-gray-900 text-lg">
                Candidate Dashboard
              </span>
            </motion.div>

            {isSmallScreen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <SidebarItem
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname.startsWith(item.path)}
                    onClick={() => handleTabClick(item.path)}
                    hasSubmenu={item.hasSubmenu}
                    isSubmenuOpen={location.pathname.startsWith(item.path)}
                    isExpanded={
                      isSidebarExpanded ||
                      isSidebarHovered ||
                      isMobileSidebarOpen
                    }
                  />
                </li>
              ))}
            </ul>

            {(isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-6"
              >
                <ProfileStrength
                  completion={
                    completion || {
                      completionPercentage: 0,
                      missingFields: [],
                    }
                  }
                />
              </motion.div>
            )}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className={`flex-1 p-4 sm:p-6 transition-all duration-300`}
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">
            {getCurrentTabHeading()}
          </h3>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default memo(CandidateLayout);
