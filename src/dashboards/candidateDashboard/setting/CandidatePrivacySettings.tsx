import React from "react";

const CandidatePrivacySettings: React.FC = () => {


  return (
    <div className="p-6">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Privacy Settings
      </h3>
      <p className="text-gray-600 mb-6">
        Manage your privacy preferences here.
      </p>

      {/* Privacy Options */}
      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Enable Two-Factor Authentication
            </p>
            <p className="text-xs text-gray-500">
              Add an extra layer of security to your account.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>

        {/* Data Sharing Preferences */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Share Data with Third Parties
            </p>
            <p className="text-xs text-gray-500">
              Control whether your data is shared with partners.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>

       
      </div>
    </div>
  );
};

export default CandidatePrivacySettings;
