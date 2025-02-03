import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Briefcase, Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import profileimg from "../../images/candidateProfile.png";
import axiosInstance from "../../components/common/axiosConfig";
import Loader from "../../components/ui/Loader";

// Lazy load heavy components
const CandidateInterviews = lazy(() => import("./CandidateInterviews"));
const CandidateStatistics = lazy(() => import("./CandidateStatistics"));

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviews, setInterviews] = useState([]);

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
            mobile: profileData.mobile || "Mobile not provided",
            countryCode: profileData.countryCode || "+00",
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
    return (status) => {
      switch (status) {
        case "Approved":
          return "bg-green-100 text-green-600";
        case "Cancelled":
          return "bg-red-100 text-red-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };
  }, []);

  const renderProfileDetails = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-101">
      <h3 className="text-xl font-semibold mb-6">Profile Details</h3>
      <table className="w-full border-separate border-spacing-2">
        <tbody>
          {[
            { label: "Full Name", value: profile.name },
            { label: "Email", value: profile.email },
            { label: "Location", value: profile.location },
            {
              label: "Mobile",
              value: `${profile.countryCode} ${profile.mobile}`,
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
        interviews.map((interview, index) => (
          <div
            key={index}
            className={`p-5 border rounded-lg flex items-center justify-between mb-6 shadow-md transition-all duration-300 ease-in-out transform ${getStatusColor(
              interview.status
            )}`}
          >
            <div>
              <h4 className="font-semibold text-gray-800 text-lg mb-2">
                {interview.interviewerName || "N/A"}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-calendar-alt text-blue-500 mr-1"></i>
                  {interview.date || "TBD"}
                </span>
                <span className="text-sm text-gray-600">
                  {interview.from || "N/A"} - {interview.to || "N/A"} GMT
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {interview.status}
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
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white shadow-lg rounded-lg p-6 h-min transition-transform transform hover:scale-105">
          <div className="flex flex-col items-center">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full bg-gray-300 mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.name}
            </h2>
            <p className="text-sm text-gray-600">{profile.jobTitle}</p>
            <button
              className="mt-4 flex items-center text-[#0077B5] hover:text-[#005885] transition-colors"
              onClick={() => navigate("/edit-candidate-profile")}
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center text-sm">
              <Phone className="w-5 h-5 mr-2" />
              {profile.countryCode} {profile.mobile}
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-5 h-5 mr-2" />
              {profile.location}
            </div>
            <div className="flex items-center text-sm">
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
                    className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full transition-transform transform hover:scale-110"
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
        <div className="md:col-span-3 space-y-8">
          {/* Profile Details */}
          {renderProfileDetails()}

          {/* Upcoming Interviews */}
          {renderInterviews()}

          {/* Lazy Loaded Components */}
          <Suspense fallback={<Loader />}>
            <CandidateInterviews />
            <CandidateStatistics />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
