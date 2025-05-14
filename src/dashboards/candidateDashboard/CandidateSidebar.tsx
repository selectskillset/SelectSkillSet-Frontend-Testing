import React, { memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, Clock, BarChart2, ChevronDown, X } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import ProfileStrength from "./ProfileStrength";

const SidebarItem = memo(
  ({
    icon,
    label,
    isActive,
    onClick,
    hasSubmenu = false,
    isSubmenuOpen = false,
    isExpanded = true,
  }: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    hasSubmenu?: boolean;
    isSubmenuOpen?: boolean;
    isExpanded?: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium shadow-sm"
          : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-800"
      } ${!isExpanded ? "justify-center" : ""}`}
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-lg ${
          isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </span>
      {isExpanded && (
        <>
          <span className="text-sm font-medium text-left flex-1">{label}</span>
          {hasSubmenu && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isSubmenuOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </>
      )}
    </motion.button>
  )
);

const SidebarSubItem = memo(
  ({
    label,
    isActive,
    onClick,
    isExpanded = true,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
    isExpanded?: boolean;
  }) => (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 pl-11 rounded-lg transition-all duration-300 text-sm ${
        isActive
          ? "bg-primary/5 text-primary font-medium border-l-4 border-primary"
          : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-800"
      } ${!isExpanded ? "justify-center" : ""}`}
    >
      {isExpanded && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {isActive && (
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </>
      )}
    </motion.button>
  )
);

const navItems = [
  {
    key: "dashboard",
    icon: <Home size={18} />,
    label: "Dashboard",
    hasSubmenu: false,
  },
  {
    key: "schedule",
    icon: <Calendar size={18} />,
    label: "Schedule an Interview",
    hasSubmenu: false,
  },
  {
    key: "upcoming",
    icon: <Clock size={18} />,
    label: "Upcoming Interviews",
    hasSubmenu: false,
  },
  {
    key: "statistics",
    icon: <BarChart2 size={18} />,
    label: "Interview Statistics",
    hasSubmenu: false,
  },

  //   {
  //     key: "settings",
  //     icon: <Settings size={18} />,
  //     label: "Settings",
  //     hasSubmenu: true,
  //     subItems: [
  //       { label: "Profile", key: "profile-settings" },
  //       { label: "Preferences", key: "preferences" },
  //     ],
  //   },
];

const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  activeTab,
  isMobileSidebarOpen,
  isSidebarExpanded,
  isSidebarHovered,
  onTabChange,
  onSidebarHover,
  onMobileSidebarClose,
  completion,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery({ maxWidth: 1023 });

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (isSmallScreen) {
      onMobileSidebarClose();
    }
  };

  const sidebarWidth = isSidebarExpanded || isSidebarHovered ? "w-72" : "w-20";

  return (
    <>
      {/* Mobile Sidebar Overlay with blur effect */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={onMobileSidebarClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar with glass morphism effect */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: isMobileSidebarOpen ? "20rem" : sidebarWidth,
          left: isMobileSidebarOpen ? "0" : isSmallScreen ? "-20rem" : "0",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-[20%] fixed lg:relative top-0 h-screen  bg-white/95 backdrop-blur-sm border-r border-gray-200/50 z-[100] lg:z-30 flex flex-col overflow-hidden ${
          isMobileSidebarOpen ? "shadow-2xl" : "shadow-sm"
        }`}
        onMouseEnter={() => !isSidebarExpanded && onSidebarHover(true)}
        onMouseLeave={() => onSidebarHover(false)}
      >
        {/* Sidebar Header with subtle gradient */}
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
            transition={{ duration: 0.3 }}
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

          <div className="flex items-center gap-2">
            {isSmallScreen && (
              <button
                onClick={onMobileSidebarClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation with smooth scrolling */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  isActive={activeTab === item.key}
                  onClick={() => handleTabClick(item.key)}
                  hasSubmenu={item.hasSubmenu}
                  isSubmenuOpen={activeTab === item.key}
                  isExpanded={
                    isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen
                  }
                />

                {item.hasSubmenu && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeTab === item.key ? "auto" : 0,
                      opacity: activeTab === item.key ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-2 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.key}>
                          <SidebarSubItem
                            label={subItem.label}
                            isActive={activeTab === subItem.key}
                            onClick={() => handleTabClick(subItem.key)}
                            isExpanded={
                              isSidebarExpanded ||
                              isSidebarHovered ||
                              isMobileSidebarOpen
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </li>
            ))}
          </ul>

          {/* Profile Strength Widget */}
          {(isSidebarExpanded || isSidebarHovered || isMobileSidebarOpen) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <ProfileStrength completion={completion} />
            </motion.div>
          )}
        </nav>
      </motion.aside>
    </>
  );
};

export default memo(CandidateSidebar);
