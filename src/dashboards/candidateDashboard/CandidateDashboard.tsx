import React, { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useCandidateContext } from "../../context/CandidateContext";
import CandidateStatistics from "./CandidateStatistics";
import CandidateProfileCompletion from "./CandidateProfileCompletion";

const CandidateDashboard: React.FC = () => {
  const { profile, isLoading, fetchProfile, error } = useCandidateContext();

  // Fetch profile data on mount if not already fetched
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // Render profile details
  const renderProfileDetails = useCallback(() => {
    if (!profile) return null;

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform">
        <h3 className="text-xl font-semibold mb-6">Profile Details</h3>
        <table className="w-full border-separate border-spacing-2">
          <tbody>
            {[
              { label: "Email", value: profile.email },
              { label: "Location", value: profile.location },
              { label: "Phone Number", value: profile.phoneNumber },
              {
                label: "LinkedIn",
                value: profile.linkedIn ? (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                ) : (
                  "Not Provided"
                ),
              },
              {
                label: "Resume",
                value: profile.resume ? (
                  <a
                    href={profile.resume}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Resume
                  </a>
                ) : (
                  "Not Provided"
                ),
              },
            ].map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 font-medium text-gray-600">
                  {item.label}
                </td>
                <td className="px-4 py-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [profile]);

  // Loading state
  if (isLoading) {
    return (
      <div className="text-gray-500 text-center flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-600 text-center flex justify-center items-center h-screen">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="w-full bg-white shadow-xl rounded-lg p-6 border-r border-gray-200 space-y-6 md:sticky top-28 h-max md:overflow-y-auto ">
          <div className="space-y-4">
            <img
              src={profile?.profilePhoto || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
            />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {profile?.name || "Unknown User"}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {profile?.jobTitle || "Job Title Not Provided"}
            </p>
          </div>
          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills.length > 0 ? (
                profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills available.</p>
              )}
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="md:col-span-3 space-y-8">
          <CandidateProfileCompletion />
          {renderProfileDetails()}
          <CandidateStatistics />
        </main>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
