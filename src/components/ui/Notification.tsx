import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

// Dummy notification data
const dummyNotifications = [
  {
    id: 1,
    title: "New Interview Scheduled",
    description: "Your interview with XYZ Corp is scheduled for tomorrow.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Profile Update Required",
    description: "Please update your profile to complete verification.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 3,
    title: "Job Application Status",
    description: "Your application for Senior Developer has been shortlisted.",
    time: "1 day ago",
    read: false,
  },
];

export const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications); // State for notifications
  const dropdownRef = useRef(null);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all notifications as read when dropdown is opened
  const handleOpenDropdown = () => {
    setIsOpen(true);
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon */}
      <motion.div
        className={`cursor-pointer relative ${unreadCount > 0 ? "bell" : ""}`}
        whileHover={{ scale: 1.05 }}
        onClick={handleOpenDropdown}
        aria-expanded={isOpen}
        aria-label="Notifications"
      >
        <Bell size={30} className="text-gray-800 hover:text-[#0077B5]" />
        {/* Badge for Unread Notifications */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-10 right-0 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-4 space-x-3 cursor-pointer ${
                      !notification.read
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      console.log(`Clicked: ${notification.title}`)
                    } // Handle click
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No notifications
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                className="text-sm font-medium text-[#0077B5] hover:underline w-full text-left"
                onClick={() => {
                  setIsOpen(false);
                  console.log("Marked all as read");
                }}
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Notification); // Optimize re-renders
