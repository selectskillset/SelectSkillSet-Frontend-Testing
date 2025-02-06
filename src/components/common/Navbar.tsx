import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Notification } from "../ui/Notification";

// Framer Motion variants for phoneNumber menu animations
const phoneNumberMenuVariants = {
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
    }
  }, [candidateToken, interviewerToken, corporateToken, adminToken, navigate]);

  // Logout and clear session tokens
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("candidateToken");
    sessionStorage.removeItem("interviewerToken");
    sessionStorage.removeItem("corporateToken");
    sessionStorage.removeItem("adminToken");
    navigate("/");
  }, [navigate]);

  // Render common menu links for desktop and phoneNumber
  const renderMenuLinks = (isphoneNumber = false) => {
    const baseLinkClass = isphoneNumber
      ? "text-gray-800 hover:text-[#0077B5] text-2xl font-medium transition duration-300"
      : "text-gray-800 hover:text-[#0077B5] text-lg font-medium transition duration-300";
    const demoButtonClass = isphoneNumber
      ? "bg-[#0077B5] text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#005885] transition duration-300"
      : "bg-[#0077B5] text-white text-lg font-semibold px-5 py-3 rounded-lg shadow-lg hover:bg-[#005885] transition duration-300";

    const isActive = (path: string) => location.pathname === path;

    return (
      <>
        <Link
          to="/"
          className={`${baseLinkClass} ${
            isActive("/") ? "text-[#0077B5] font-bold" : ""
          }`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`${baseLinkClass} ${
            isActive("/products") ? "text-[#0077B5] font-bold" : ""
          }`}
          onClick={closeMenu}
        >
          Products
        </Link>
        <Link
          to="/about"
          className={`${baseLinkClass} ${
            isActive("/about") ? "text-[#0077B5] font-bold" : ""
          }`}
          onClick={closeMenu}
        >
          About Us
        </Link>
        <Link
          to="/interviewer-signup"
          className={`${baseLinkClass} ${
            isActive("/interviewer-signup") ? "text-[#0077B5] font-bold" : ""
          }`}
          onClick={closeMenu}
        >
          Become an Interviewer
        </Link>
        <Link
          to="/login"
          className={`${baseLinkClass} ${
            isActive("/login") ? "text-[#0077B5] font-bold" : ""
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
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {!userLoggedIn ? (
              renderMenuLinks(false)
            ) : (
              <>
                <Notification />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-red-500 transition duration-300"
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>

          {/* phoneNumber Menu Button and Notification */}
          <div className="md:hidden flex items-center space-x-4">
            {userLoggedIn && <Notification />}
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

      {/* phoneNumber Menu */}
      <motion.div
        ref={menuRef}
        variants={phoneNumberMenuVariants}
        initial="hidden"
        animate={isMenuOpen ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="md:hidden fixed top-0 right-0 h-screen bg-white shadow-xl z-50 w-3/4"
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
        <div className="flex flex-col items-center space-y-8 mt-12">
          {!userLoggedIn ? (
            renderMenuLinks(true)
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="bg-red-600 text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-red-500 transition duration-300"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
