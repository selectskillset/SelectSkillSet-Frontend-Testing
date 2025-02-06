import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Eye, Search, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import profileimg from "../../images/candidateProfile.png";
import axiosInstance from "../../components/common/axiosConfig";
import DashboardSkeletonLoader from "../../components/ui/DashboardSkeletonLoader";

// Lazy load heavy components
const CandidateInterviews = lazy(() => import("./CandidateInterviews"));
const CandidateStatistics = lazy(() => import("./CandidateStatistics"));

const CandidateDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = sessionStorage.getItem("candidateToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const [profileResponse, interviewResponse] = await Promise.all([
          axiosInstance.get("/candidate/getProfile"),
          axiosInstance.get("/candidate/myInterviews"),
        ]);

        if (profileResponse.data?.success) {
          const profileData = profileResponse.data.profile || {};
          setProfile({
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email || "Email not provided",
            skills: profileData.skills || [],
            location: profileData.location || "Location not provided",
            phoneNumber: profileData.phoneNumber || "phoneNumber not provided",

            jobTitle: profileData.jobTitle || "Job title not provided",
            profilePhoto: profileData.profilePhoto || profileimg,
            linkedIn: profileData.linkedIn || "",
            resume: profileData.resume || "",
            feedback: profileData.statistics?.feedbacks || [],
          });
        } else {
          setError("Failed to fetch profile data.");
        }

        if (interviewResponse.data?.success) {
          setInterviews(interviewResponse.data.interviews || []);
        } else {
          setError("Failed to fetch interviews.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const getStatusColor = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case "Approved":
          return "bg-green-100 text-green-600";
        case "Cancelled":
          return "bg-red-100 text-red-600";
        case "Requested":
          return "bg-yellow-100 text-yellow-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };
  }, []);

  const renderProfileDetails = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform ">
      <h3 className="text-xl font-semibold mb-6">Profile Details</h3>
      <table className="w-full border-separate border-spacing-2">
        <tbody>
          {[
            { label: "Full Name", value: profile.name },
            { label: "Email", value: profile.email },
            { label: "Location", value: profile.location },
            {
              label: "Phone Number",
              value: profile.phoneNumber,
            },
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

  const renderInterviews = () => (
    <div className="bg-white shadow-xl rounded-lg p-6 transition-transform transform">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        My Upcoming Interviews
      </h3>
      {interviews.length > 0 ? (
        interviews.map((interview) => (
          <div
            key={interview.id}
            className={`p-5 border rounded-lg flex items-center justify-between mb-6 shadow-md transition-all duration-300 ease-in-out transform hover:shadow-lg cursor-pointer ${getStatusColor(
              interview.status
            )}`}
            onClick={() =>
              navigate(`/interviewer-profile/${interview.interviewerId}`)
            } // Navigate on click
          >
            <div className="flex items-center space-x-4">
              {/* Interviewer Photo */}
              <img
                src={interview.interviewerPhoto || profileimg}
                alt={interview.interviewerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                {/* Interviewer Name */}
                <h4 className="font-semibold text-gray-800 text-lg mb-1">
                  {interview.interviewerName || "N/A"}
                </h4>
                {/* Date and Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{interview.date || "TBD"}</span>
                  <span>|</span>
                  <span>
                    {interview.from || "N/A"} - {interview.to || "N/A"} GMT
                  </span>
                </div>
              </div>
            </div>
            {/* Status */}
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                interview.status
              )}`}
            >
              {interview.status || "Unknown"}
            </span>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 font-semibold text-lg">
            No scheduled interviews.
          </p>
        </div>
      )}
    </div>
  );
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeletonLoader />;
  }

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="w-full bg-white  shadow-xl rounded-lg p-6 border-r border-gray-200 space-y-6 md:sticky top-20 h-[600px] md:overflow-y-auto">
          {/* Profile Card */}
          <div className="space-y-4">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
            />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {profile.name}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {profile.jobTitle}
            </p>
            <button
              onClick={() => navigate("/edit-candidate-profile")}
              className="w-full bg-[#0077B5] text-white py-2 rounded-md hover:bg-[#005f99] transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
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

          {/* Profile Viewers */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Profile Insights
            </h3>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-gray-500" />
              <p className="text-sm text-gray-600">
                Profile Views: <span className="font-medium">1,234</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <p className="text-sm text-gray-600">
                Search Appearances: <span className="font-medium">567</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-gray-500" />
              <p className="text-sm text-gray-600">
                Recruiter Actions: <span className="font-medium">45</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Details */}
          {renderProfileDetails()}
          {/* Upcoming Interviews */}
          {renderInterviews()}
          {/* Lazy Loaded Components */}
          <Suspense>
            <CandidateInterviews />
            <CandidateStatistics />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
