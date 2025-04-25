import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Package,
  Info,
  UserPlus,
  Calendar,
  Clock,
  User,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../images/selectskillset_logo__2_-removebg-preview.png";

const MOBILE_MENU_VARIANTS = {
  hidden: { x: "100%", transition: { duration: 0.3 } },
  visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const SCROLL_THRESHOLD = 100;
const THROTTLE_DELAY = 100;

const NAV_LINKS = {
  common: [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    // { path: "/products", label: "Products", icon: <Package size={20} /> },
    { path: "/about", label: "About Us", icon: <Info size={20} /> },
    {
      path: "/interviewer-signup",
      label: "Become An Interviewer",
      icon: <UserPlus size={20} />,
    },
    { path: "/login", label: "Login", icon: <UserPlus size={20} /> },
  ],
  candidate: [
    {
      path: "/candidate-dashboard",
      label: "Dashboard",
      icon: <User size={20} />,
    },
    {
      path: "/candidate-schedule-interviews",
      label: "Schedule Interview",
      icon: <Calendar size={20} />,
    },
    {
      path: "/candidate-interviews",
      label: "Upcoming Interviews",
      icon: <Clock size={20} />,
    },
    {
      path: "/candidate-settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ],
  interviewer: [
    {
      path: "/interviewer-dashboard",
      label: "Dashboard",
      icon: <User size={20} />,
    },
    {
      path: "/interviewer-availability",
      label: "My Availability",
      icon: <Calendar size={20} />,
    },
    {
      path: "/interviewer-requests",
      label: "Interview Requests",
      icon: <Clock size={20} />,
    },
    {
      path: "/interviewer-settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ],
  corporate: [
    {
      path: "/corporate-dashboard",
      label: "Dashboard",
      icon: <User size={20} />,
    },
    {
      path: "/corporate-settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ],
  admin: [
    {
      path: "/admin/dashboard/profiles",
      label: "Users",
      icon: <User size={20} />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ],
};

export const Navbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Get user tokens with location dependency
  const tokens = useMemo(
    () => ({
      candidate: sessionStorage.getItem("candidateToken"),
      interviewer: sessionStorage.getItem("interviewerToken"),
      corporate: sessionStorage.getItem("corporateToken"),
      admin: sessionStorage.getItem("adminToken"),
    }),
    [location] // Recalculate tokens when location changes
  );

  // Determine user type
  const userType = useMemo(() => {
    if (tokens.candidate) return "candidate";
    if (tokens.interviewer) return "interviewer";
    if (tokens.corporate) return "corporate";
    if (tokens.admin) return "admin";
    return null;
  }, [tokens]);

  const userLoggedIn = !!userType;

  // Scroll handling with throttle
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const shouldHide =
      currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD;
    setIsVisible(!shouldHide);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, THROTTLE_DELAY);
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Click outside handler
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Navigation handlers
  const handleProfileNavigation = useCallback(() => {
    const dashboardPath = userType ? `/${userType}-dashboard` : "/";
    navigate(dashboardPath);
  }, [userType, navigate]);

  // Memoized navigation links
  const currentLinks = useMemo(() => {
    return userLoggedIn ? NAV_LINKS[userType] : NAV_LINKS.common;
  }, [userLoggedIn, userType]);

  const renderLinks = useCallback(
    (isMobile = false) =>
      currentLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={() => {
            if (isMobile) {
              setIsMenuOpen(false);
            }
          }}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              isMobile ? "text-xl" : "text-base"
            } ${
              isActive
                ? "text-primary bg-primary/10 font-bold underline"
                : "hover:bg-primary/10 font-medium hover:text-primary"
            }`
          }
        >
          {isMobile && React.cloneElement(link.icon, { size: 24 })}
          {link.label}
        </NavLink>
      )),
    [currentLinks]
  );

  return (
    <nav
      className={`bg-white shadow-xl sticky top-0 z-50 transition-transform duration-300  ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={handleProfileNavigation}
          >
            <img src={logo} alt="Selectskillset" className="h-20 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {renderLinks()}
            {!userLoggedIn && <RequestDemoButton />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-800 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            variants={MOBILE_MENU_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-50 h-[100vh]"
          >
            <div className="p-6 h-auto bg-white flex flex-col">
              <div className="flex justify-end items-center mb-6">
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={24} className="text-gray-800 hover:text-primary" />
                </button>
              </div>

              <div className="flex-1 space-y-4">{renderLinks(true)}</div>

              {!userLoggedIn && (
                <div className="pt-6 border-t border-gray-100">
                  <RequestDemoButton mobile />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

const RequestDemoButton = React.memo(({ mobile }: { mobile?: boolean }) => (
  <Link
    to="/request-demo"
    className={`bg-gradient-to-r from-primary to-secondary text-white font-medium
      hover:from-secondary hover:to-primary transition-all duration-300 shadow-md
       ${mobile ? "w-full text-center" : ""} px-6 py-3 rounded-lg`}
  >
    Request Demo
  </Link>
));

// Throttle utility
function throttle<T extends (...args: any[]) => any>(fn: T, limit: number) {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
}

export default Navbar;
