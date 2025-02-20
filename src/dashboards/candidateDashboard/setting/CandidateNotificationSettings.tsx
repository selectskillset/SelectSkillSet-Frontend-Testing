import React from "react";

const CandidateNotificationSettings: React.FC = () => {
  return (
    <div className="p-6 ">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Notification Settings
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Customize how you receive notifications from our platform.
      </p>

      {/* Notification Options */}
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Email Notifications
            </p>
            <p className="text-xs text-gray-500">
              Receive email updates about your activity.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked
              aria-label="Toggle Email Notifications"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>

        {/* Push Notifications */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Push Notifications
            </p>
            <p className="text-xs text-gray-500">
              Get instant notifications on your device.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              aria-label="Toggle Push Notifications"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>

        {/* SMS Notifications */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              SMS Notifications
            </p>
            <p className="text-xs text-gray-500">
              Receive important updates via text messages.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              aria-label="Toggle SMS Notifications"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>

        {/* In-App Notifications */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800">
              In-App Notifications
            </p>
            <p className="text-xs text-gray-500">
              Receive notifications directly within the app.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked
              aria-label="Toggle In-App Notifications"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0A66C2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CandidateNotificationSettings;
