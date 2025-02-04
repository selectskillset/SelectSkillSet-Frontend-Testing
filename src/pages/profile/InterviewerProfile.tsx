import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import { motion } from "framer-motion";
import Loader from "../../components/ui/Loader";
import { MapPin } from "lucide-react";

const InterviewerProfile = () => {
  const { id } = useParams();
  const [interviewer, setInterviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/candidate/getInterviewerProfile/${id}`
        );
        setInterviewer(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviewer profile:", err);
        setError(
          "Failed to fetch interviewer profile. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewer();
  }, [id]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-red-100 p-6 rounded-lg shadow-lg">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-500 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen  py-8 px-4 sm:px-8"
    >
      {/* Profile Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 p-8">
        {/* Sidebar: Profile Header */}
        <div className="bg-gray-50 p-6 h-[400px] rounded-2xl border border-gray-200 shadow-sm space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={
                interviewer.profilePhoto || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-800">
              {`${interviewer.firstName} ${interviewer.lastName}`}
            </h1>
            {/* Job Title */}
            <p className="text-md text-gray-600">
              {interviewer.jobTitle || "Job title not provided"}
            </p>
            {/* Location */}
            <p className="text-sm flex items-center gap-2 text-gray-500">
              <MapPin size={16} />{" "}
              {interviewer.location || "Location not provided"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="font-medium">LinkedIn:</span>{" "}
                {interviewer.linkedIn || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content: Experience, Skills, Availability, Feedback */}
        <div className="space-y-8">
          {/* About Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              vel ex vel nisi aliquet dictum. Proin vitae augue nec nisl
              tincidunt convallis.
            </p>
          </div>

          {/* Experience and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Experience */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Experience
              </h3>
              <p className="text-xl mt-2 text-gray-800">
                {interviewer.experience || "Not specified"}
              </p>
            </div>
            {/* Interview Pricing */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">
                Interview Pricing
              </h3>
              <p className="text-xl mt-2 text-gray-800">
                {interviewer.price ? `$${interviewer.price}` : "Not specified"}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {interviewer.skills && interviewer.skills.length > 0 ? (
                interviewer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed.</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Availability
            </h2>
            <div className="space-y-4">
              {interviewer.availability &&
              interviewer.availability.length > 0 ? (
                interviewer.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border-l-4 border-green-500 rounded-2xl shadow-sm"
                  >
                    <p>
                      <span className="font-medium text-gray-700">Date:</span>{" "}
                      {slot.date}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Time:</span>{" "}
                      {slot.from} - {slot.to}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No availability data.</p>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Feedback</h2>
            <div className="space-y-4">
              {interviewer.feedbacks && interviewer.feedbacks.length > 0 ? (
                interviewer.feedbacks.map((feedback, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border-l-4 border-yellow-500 rounded-2xl shadow-sm"
                  >
                    <p className="text-gray-800">
                      {feedback.feedbackData.comments ||
                        "No comments provided."}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rating: {feedback.rating} / 5
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No feedback available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewerProfile;
