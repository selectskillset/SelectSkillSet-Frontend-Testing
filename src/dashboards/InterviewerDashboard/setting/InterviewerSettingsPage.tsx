import React, { useState, useEffect } from "react";
import { Settings, Lock, FileText, Wallet, X } from "lucide-react";
import InterviewerAccountSettings from "./InterviewerAccountSettings";
import InterviewerPrivacySettings from "./InterviewerPrivacySettings";
import InterviewerTermsAndConditions from "./InterviewerTermsAndConditions";
import InterviewerBankAccountSettings from "./InterviewerBankAccountSettings";

enum InterviewerSettingsSection {
  ACCOUNT = "Account",
  BANK_ACCOUNT = "Bank Account",
  PRIVACY = "Privacy",
  TERMS = "Terms & Conditions",
}

const InterviewerSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<InterviewerSettingsSection>(InterviewerSettingsSection.ACCOUNT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settingsOptions = [
    {
      icon: <Settings size={20} />,
      label: InterviewerSettingsSection.ACCOUNT,
      component: <InterviewerAccountSettings />,
    },
    {
      icon: <Wallet size={20} />,
      label: InterviewerSettingsSection.BANK_ACCOUNT,
      component: <InterviewerBankAccountSettings />,
    },
    {
      icon: <Lock size={20} />,
      label: InterviewerSettingsSection.PRIVACY,
      component: <InterviewerPrivacySettings />,
    },
    {
      icon: <FileText size={20} />,
      label: InterviewerSettingsSection.TERMS,
      component: <InterviewerTermsAndConditions />,
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSectionChange = (section: InterviewerSettingsSection) => {
    setActiveSection(section);
    if (isMobile) closeSidebar();
  };

  return (
    <div className="flex min-h-screen  max-w-7xl mx-auto p-4 space-y-6 border border-gray-100 rounded-xl bg-white shadow-sm my-5">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-24 right-4 p-2 z-50 lg:z-30 lg:hidden bg-white rounded-full "
        aria-label="Toggle settings menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-white  p-4 space-y-2 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 p-2">
          Settings
        </h2>
        <div className="space-y-1">
          {settingsOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSectionChange(option.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === option.label
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="[&>svg]:w-5 [&>svg]:h-5">{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto ">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm ">
          {
            settingsOptions.find((opt) => opt.label === activeSection)
              ?.component
          }
        </div>
      </main>
    </div>
  );
};

export default InterviewerSettingsPage;
