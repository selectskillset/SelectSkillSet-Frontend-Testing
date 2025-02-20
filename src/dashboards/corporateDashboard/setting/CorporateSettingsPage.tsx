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
import CorporateAccountSettings from "./CorporateAccountSettings";
import CorporatePrivacySettings from "./CorporatePrivacySettings";
import CorporateNotificationSettings from "./CorporateNotificationSettings";
import CorporateContactSupport from "./CorporateContactSupport";
import CorporateReportProblem from "./CorporateReportProblem";
import CorporateTermsAndConditions from "./CorporateTermsAndConditions";

// Enum for settings sections
enum CorporateSettingsSection {
  ACCOUNT = "Account Settings",
  PRIVACY = "Privacy",
  NOTIFICATIONS = "Notifications",
  SUPPORT = "Contact Support",
  REPORT = "Report a Problem",
  TERMS = "Terms & Conditions",
}

const CorporateSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<CorporateSettingsSection>(CorporateSettingsSection.ACCOUNT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define settings options with icons
  const settingsOptions = [
    { icon: <Settings size={20} />, label: CorporateSettingsSection.ACCOUNT },
    { icon: <Lock size={20} />, label: CorporateSettingsSection.PRIVACY },
    {
      icon: <Bell size={20} />,
      label: CorporateSettingsSection.NOTIFICATIONS,
    },
    { icon: <Mail size={20} />, label: CorporateSettingsSection.SUPPORT },
    {
      icon: <AlertTriangle size={20} />,
      label: CorporateSettingsSection.REPORT,
    },
    { icon: <FileText size={20} />, label: CorporateSettingsSection.TERMS },
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
        {activeSection === CorporateSettingsSection.ACCOUNT && (
          <CorporateAccountSettings />
        )}
        {activeSection === CorporateSettingsSection.PRIVACY && (
          <CorporatePrivacySettings />
        )}
        {activeSection === CorporateSettingsSection.NOTIFICATIONS && (
          <CorporateNotificationSettings />
        )}
        {activeSection === CorporateSettingsSection.SUPPORT && (
          <CorporateContactSupport />
        )}
        {activeSection === CorporateSettingsSection.REPORT && (
          <CorporateReportProblem />
        )}
        {activeSection === CorporateSettingsSection.TERMS && (
          <CorporateTermsAndConditions />
        )}
      </main>
    </div>
  );
};

export default CorporateSettingsPage;
