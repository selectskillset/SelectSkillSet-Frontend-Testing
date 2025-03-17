import React, { useState } from "react";
import { Settings } from "lucide-react";

// Import Section Components

import AdminAccountSettings from "./AdminAccountSettings";

// Enum for settings sections
enum AdminSettingsSection {
  ACCOUNT = "Account Settings",
}

const AdminSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSettingsSection>(
    AdminSettingsSection.ACCOUNT
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define settings options with icons
  const settingsOptions = [
    { icon: <Settings size={20} />, label: AdminSettingsSection.ACCOUNT },
  ];

  // Handle outside click to close the sidebar
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.target as Node)) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-24 right-4  p-2  lg:hidden"
      >
        {isSidebarOpen ? "" : <Settings size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:translate-x-0 top-20 left-0 h-screen w-64 bg-white shadow-md p-4 space-y-2 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
        {settingsOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => {
              setActiveSection(option.label);
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === option.label
                ? "bg-[#0A66C2] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
        ></div>
      )}

      {/* Main Content Area */}
      <main
        onClick={(e) => handleOutsideClick(e)}
        className="flex-1 p-6 overflow-y-auto "
      >
        {activeSection === AdminSettingsSection.ACCOUNT && (
          <AdminAccountSettings />
        )}
      </main>
    </div>
  );
};

export default AdminSettingsPage;
