import React, { useContext, useEffect, useMemo } from "react";
import { Briefcase, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { InterviewerContext } from "../../context/InterviewerContext";
import InterviewerStatistics from "./InterviewerStatistics";
import profileimg from "../../images/interviewerProfile.png";
import InterviewerDashboardSkeletonLoader from "../../components/ui/InterviewerDashboardSkeleton";
import InterviewerProfileCompletion from "./InterviewerProfileCompletion";

const InterviewerDashboard = () => {
  const { profile, fetchProfile } = useContext(InterviewerContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch profile data

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfile();
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          "An error occurred while fetching the profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchProfile]);

  // Error state rendering
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  // Loading state rendering
  if (isLoading || !profile) {
    return <InterviewerDashboardSkeletonLoader />;
  }

  return (
    <motion.div className="min-h-screen ">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <ProfileSidebar profile={profile} navigate={navigate} />
          {/* Main Content */}
          <div className="flex-1 space-y-10 w-full md:w-1/4 h-full">
            <InterviewerProfileCompletion />
            <div className=" bg-white shadow-lg rounded-lg p-6">
              <InterviewerStatistics />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Profile Sidebar Component
const ProfileSidebar = React.memo(
  ({ profile, navigate }: { profile: any; navigate: any }) => {
    const skillsList = useMemo(
      () =>
        profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills available.</p>
        ),
      [profile.skills]
    );

    return (
      <div className="w-full md:w-1/4 h-full bg-white shadow-lg rounded-lg p-6 md:sticky top-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden mb-4">
            <img
              src={profile.profilePhoto || profileimg}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {profile.name}
          </h2>
          <p className="text-gray-600 text-center">{profile.jobTitle}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-5 h-5 mr-2 text-gray-500" />
            <span>{profile.phoneNumber}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
            <span>{profile.jobTitle}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
          {skillsList}
        </div>
      </div>
    );
  }
);

export default InterviewerDashboard;
