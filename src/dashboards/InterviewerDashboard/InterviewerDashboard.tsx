import { useState, useEffect } from "react";
import { Briefcase, Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import InterviewRequests from "./InterviewRequests";
import InterviewerStatistics from "./InterviewerStatistics";
import InterviewAvailability from "./InterviewAvailability";
import profileimg from "../../images/interviewerProfile.png";
import Loader from "../../components/ui/Loader";

const InterviewerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/interviewer/getProfile");

        if (response.data && response.data.success) {
          const profileData = response.data.profile;

          setProfile({
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email,
            location: profileData.location || "Location not provided",
            mobile: profileData.mobile || "Mobile not provided",
            jobTitle: profileData.jobTitle || "Job title not provided",
            profilePhoto: profileData.profilePhoto || profileimg,
            skills: profileData.skills || [],
            interviewRequests: profileData.interviewRequests || [],
            completedInterviews:
              profileData.statistics.completedInterviews || 0,
            pendingRequests: profileData.statistics.pendingRequests || 0,
            totalAccepted: profileData.statistics.totalAccepted || 0,
            averageRating: profileData.statistics.averageRating || 0,
            feedbacks: profileData.feedbacks || [],
            availability: profileData.availability,
          });
        } else {
          setError("Failed to fetch profile data. Please check the response.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          "An error occurred while fetching the profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-100"
          >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="w-full md:w-1/4 h-full bg-white shadow-xl rounded-lg p-6">
                  <div className="flex flex-col items-center mb-8 relative">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden mb-4 relative">
                      <img
                        src={profile.profilePhoto}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <h2 className="text-2xl font-semibold text-center">
                      {profile.name}
                    </h2>
                    <p className="text-gray-500 text-center">
                      {profile.jobTitle}
                    </p>

                    <button
                      className="mt-4 text-[#0077B5] hover:text-[#005885] flex items-center"
                      onClick={() => navigate("/edit-interviewer-profile")}
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Profile
                    </button>
                  </div>

                  <div className="mt-4 space-y-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-5 h-5 mr-2" />
                      {profile.mobile}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      {profile.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-5 h-5 mr-2" />
                      {profile.jobTitle}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    {profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills available.</p>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10">
                  {/* Profile Details Table */}
                  <div className="bg-white shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                      Profile Details
                    </h2>
                    <table className="min-w-full table-auto border-separate border-spacing-2">
                      <tbody>
                        {[
                          { label: "Full Name", value: profile.name },
                          { label: "Email", value: profile.email },
                        ].map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-4 py-2 text-left font-medium text-gray-600">
                              {item.label}
                            </td>
                            <td className="px-4 py-2 text-left text-gray-700">
                              {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <InterviewAvailability
                    allAvailability={profile.availability}
                  />
                  <InterviewRequests requests={profile.interviewRequests} />
                  <InterviewerStatistics />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default InterviewerDashboard;
