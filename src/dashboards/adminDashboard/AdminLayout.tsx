import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  BarChart2,
  Settings,
  Shield,
  FileText,
  ChevronDown,
  X,
  Menu,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";

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
}

const navItems: NavItem[] = [
  {
    key: "dashboard",
    path: "/admin/dashboard",
    icon: <Home size={18} />,
    label: "Dashboard",
  },
  {
    key: "profiles",
    path: "/admin/profiles",
    icon: <Users size={18} />,
    label: "Manage Admins",
  },
  {
    key: "candidates",
    path: "/admin/table?userType=candidates",
    icon: <Users size={18} />,
    label: "Candidates",
  },
  {
    key: "interviewers",
    path: "/admin/table?userType=interviewers",
    icon: <UserCheck size={18} />,
    label: "Interviewers",
  },
  {
    key: "corporates",
    path: "/admin/table?userType=corporates",
    icon: <Briefcase size={18} />,
    label: "Corporates",
  },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      if (isSmallScreen) setIsMobileSidebarOpen(false);
    },
    [navigate, isSmallScreen]
  );

  const toggleSidebar = useCallback(() => {
    isSmallScreen
      ? setIsMobileSidebarOpen((prev) => !prev)
      : setIsSidebarExpanded((prev) => !prev);
  }, [isSmallScreen]);

  const sidebarWidth = isSidebarExpanded || isSidebarHovered ? "w-72" : "w-20";

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

  const getCurrentTabHeading = useCallback(() => {
    const currentItem = navItems.find((item) => {
      if (item.path.includes("userType")) {
        const currentUserType = new URLSearchParams(location.search).get(
          "userType"
        );
        const itemUserType = new URLSearchParams(item.path.split("?")[1]).get(
          "userType"
        );
        return currentUserType === itemUserType;
      }
      return location.pathname === item.path.split("?")[0];
    });
    return currentItem?.label || "Admin Dashboard";
  }, [location]);

  const isTabActive = useCallback(
    (itemPath: string) => {
      // Handle userType paths differently
      if (itemPath.includes("userType")) {
        const currentUserType = new URLSearchParams(location.search).get(
          "userType"
        );
        const itemUserType = new URLSearchParams(itemPath.split("?")[1]).get(
          "userType"
        );
        return currentUserType === itemUserType;
      }

      // Handle regular paths
      return location.pathname === itemPath.split("?")[0];
    },
    [location]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden sticky top-0 z-40 bg-white p-4 flex justify-between items-center shadow-sm border-b border-gray-100"
      >
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {getCurrentTabHeading()}
        </h1>
        <div className="w-5 h-5" />
      </motion.header>

      <div className="flex pt-16 lg:pt-0 flex-1">
        {/* Sidebar Backdrop */}
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

        {/* Sidebar */}
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
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-gray-900 text-lg">
                Admin Console
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
                    isActive={isTabActive(item.path)}
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
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 `}>
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(AdminLayout);
