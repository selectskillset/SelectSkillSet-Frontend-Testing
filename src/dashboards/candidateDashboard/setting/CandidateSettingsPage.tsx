import React, { useState } from "react";
import {
  Settings,
  Lock,
  Bell,
  Mail,
  AlertTriangle,
  FileText,
} from "lucide-react";

// Import Section Components
import CandidatePrivacySettings from "./CandidatePrivacySettings";
import CandidateNotificationSettings from "./CandidateNotificationSettings";
import CandidateContactSupport from "./CandidateContactSupport";
import CandidateReportProblem from "./CandidateReportProblem";
import CandidateTermsAndConditions from "./CandidateTermsAndConditions";
import CandidateAccountSettings from "./CandidateAccountSettings";

// Enum for settings sections
enum CandidateSettingsSection {
  ACCOUNT = "Account Settings",
  PRIVACY = "Privacy",
  NOTIFICATIONS = "Notifications",
  SUPPORT = "Contact Support",
  REPORT = "Report a Problem",
  TERMS = "Terms & Conditions",
}

const CandidateSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<CandidateSettingsSection>(CandidateSettingsSection.ACCOUNT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define settings options with icons
  const settingsOptions = [
    { icon: <Settings size={20} />, label: CandidateSettingsSection.ACCOUNT },
    { icon: <Lock size={20} />, label: CandidateSettingsSection.PRIVACY },
    {
      icon: <Bell size={20} />,
      label: CandidateSettingsSection.NOTIFICATIONS,
    },
    { icon: <Mail size={20} />, label: CandidateSettingsSection.SUPPORT },
    {
      icon: <AlertTriangle size={20} />,
      label: CandidateSettingsSection.REPORT,
    },
    { icon: <FileText size={20} />, label: CandidateSettingsSection.TERMS },
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
        {activeSection === CandidateSettingsSection.ACCOUNT && (
          <CandidateAccountSettings />
        )}
        {activeSection === CandidateSettingsSection.PRIVACY && (
          <CandidatePrivacySettings />
        )}
        {activeSection === CandidateSettingsSection.NOTIFICATIONS && (
          <CandidateNotificationSettings />
        )}
        {activeSection === CandidateSettingsSection.SUPPORT && (
          <CandidateContactSupport />
        )}
        {activeSection === CandidateSettingsSection.REPORT && (
          <CandidateReportProblem />
        )}
        {activeSection === CandidateSettingsSection.TERMS && (
          <CandidateTermsAndConditions />
        )}
      </main>
    </div>
  );
};

export default CandidateSettingsPage;
