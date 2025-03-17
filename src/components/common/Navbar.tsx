import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

// Framer Motion variants for mobile menu animations
const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To track the current route
  const menuRef = useRef(null);

  // Retrieve tokens from sessionStorage
  const candidateToken = sessionStorage.getItem("candidateToken");
  const interviewerToken = sessionStorage.getItem("interviewerToken");
  const corporateToken = sessionStorage.getItem("corporateToken");
  const adminToken = sessionStorage.getItem("adminToken");

  // Determine if any user is logged in
  const userLoggedIn = useMemo(
    () =>
      !!(candidateToken || interviewerToken || corporateToken || adminToken),
    [candidateToken, interviewerToken, corporateToken, adminToken]
  );

  // Close menu if click occurs outside of it
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Navigate based on the user type
  const handleProfileNavigation = useCallback(() => {
    if (candidateToken) {
      navigate("/candidate-dashboard");
    } else if (interviewerToken) {
      navigate("/interviewer-dashboard");
    } else if (corporateToken) {
      navigate("/corporate-dashboard");
    } else if (adminToken) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }, [candidateToken, interviewerToken, corporateToken, adminToken, navigate]);

  // Render common menu links for desktop and mobile
  const renderCommonMenuLinks = (isMobile = false) => {
    const baseLinkClass = isMobile
      ? "text-gray-800 hover:text-[#0077B5] text-2xl font-medium transition duration-300 block py-2"
      : "text-gray-800 hover:text-[#0077B5] text-lg font-medium transition duration-300";
    const demoButtonClass = isMobile
      ? "bg-[#0077B5] text-white text-xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#005885] transition duration-300 w-full mt-4"
      : "bg-[#0077B5] text-white text-lg font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-[#005885] transition duration-300 ml-auto";
    const isActive = (path: string) => location.pathname === path;

    return (
      <>
        <Link
          to="/"
          className={`${baseLinkClass} ${
            isActive("/") ? "text-[#0077B5] font-bold underline" : ""
          }`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`${baseLinkClass} ${
            isActive("/products") ? "text-[#0077B5] font-bold underline" : ""
          }`}
          onClick={closeMenu}
        >
          Products
        </Link>
        <Link
          to="/about"
          className={`${baseLinkClass} ${
            isActive("/about") ? "text-[#0077B5] font-bold underline" : ""
          }`}
          onClick={closeMenu}
        >
          About Us
        </Link>
        <Link
          to="/interviewer-signup"
          className={`${baseLinkClass} ${
            isActive("/interviewer-signup") ? "text-[#0077B5] font-bold underline" : ""
          }`}
          onClick={closeMenu}
        >
          Become an Interviewer
        </Link>
        <Link
          to="/login"
          className={`${baseLinkClass} ${
            isActive("/login") ? "text-[#0077B5] font-bold underline" : ""
          }`}
          onClick={closeMenu}
        >
          Login
        </Link>
        <Link
          to="/request-demo"
          className={demoButtonClass}
          onClick={closeMenu}
        >
          Request Demo
        </Link>
      </>
    );
  };

  // Render user-specific tabs
  const renderUserTabs = (isMobile = false) => {
    const tabClass = isMobile
      ? " text-2xl font-medium transition duration-300 block py-2"
      : " text-lg font-medium transition duration-300 ";
    const isActive = (path: string) => location.pathname === path;

    if (candidateToken) {
      return (
        <>
          <Link
            to="/candidate-dashboard"
            className={`${tabClass} ${
              isActive("/candidate-dashboard")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/candidate-schedule-interviews"
            className={`${tabClass} ${
              isActive("/candidate-schedule-interviews")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Schedule Interview
          </Link>
          <Link
            to="/candidate-interviews"
            className={`${tabClass} ${
              isActive("/candidate-interviews")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            My Upcoming Interviews
          </Link>
          <Link
            to="/candidate-settings"
            className={`${tabClass} ${
              isActive("/candidate-settings")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Settings
          </Link>
        </>
      );
    } else if (interviewerToken) {
      return (
        <>
          <Link
            to="/interviewer-dashboard"
            className={`${tabClass} ${
              isActive("/interviewer-dashboard")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/interviewer-availability"
            className={`${tabClass} ${
              isActive("/interviewer-availability")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            My Availability
          </Link>
          <Link
            to="/interviewer-requests"
            className={`${tabClass} ${
              isActive("/interviewer-requests")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Interview Requests
          </Link>
          <Link
            to="/interviewer-settings"
            className={`${tabClass} ${
              isActive("/interviewer-settings")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Settings
          </Link>
        </>
      );
    } else if (corporateToken) {
      return (
        <>
          <Link
            to="/corporate-dashboard"
            className={`${tabClass} ${
              isActive("/corporate-dashboard")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          
          <Link
            to="/corporate-settings"
            className={`${tabClass} ${
              isActive("/corporate-settings")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Settings
          </Link>
        </>
      );
    } else if (adminToken) {
      return (
        <>
          <Link
            to="/admin/dashboard/profiles"
            className={`${tabClass} ${
              isActive("/admin/dashboard/profiles")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Users
          </Link>
          <Link
            to="/admin/settings"
            className={`${tabClass} ${
              isActive("/admin/settings")
                ? "text-[#0077B5] font-bold underline"
                : ""
            }`}
            onClick={closeMenu}
          >
            Settings
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 left-0 w-full z-50">
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Brand/Logo Section */}
          <div className="flex items-center space-x-4">
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={handleProfileNavigation}
              className="cursor-pointer text-[#0077B5] text-3xl font-extrabold uppercase"
            >
              Selectskillset
            </motion.span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            {!userLoggedIn ? renderCommonMenuLinks() : renderUserTabs()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        ref={menuRef}
        variants={mobileMenuVariants}
        initial="hidden"
        animate={isMenuOpen ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="md:hidden fixed top-0 right-0 h-screen bg-white shadow-xl z-50 w-3/4 overflow-y-auto"
      >
        <div className="flex justify-end p-5">
          <button
            onClick={closeMenu}
            aria-label="Close Menu"
            className="text-gray-800 focus:outline-none"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {!userLoggedIn ? renderCommonMenuLinks(true) : renderUserTabs(true)}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
