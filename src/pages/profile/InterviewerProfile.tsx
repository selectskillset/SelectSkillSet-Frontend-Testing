import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import { motion } from "framer-motion";
import Loader from "../../components/ui/Loader";
import { MapPin} from "lucide-react";

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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-8"
    >
      <div className="max-w-7xl mx-auto  rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar: Profile Header */}
        <div className="col-span-1 bg-white p-4 h-max rounded-xl border shadow-md">
          <div className="flex flex-col items-center gap-6">
            <img
              src={interviewer.profilePhoto}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <h1 className="text-3xl font-semibold text-gray-800">
              {`${interviewer.firstName} ${interviewer.lastName}`}
            </h1>
            <p className="text-lg text-gray-600">{interviewer.jobTitle}</p>
            <p className="text-sm mt-2 flex items-center gap-2 text-gray-500">
              <MapPin size={18} />{" "}
              {interviewer.location || "Location not provided"}
            </p>
          </div>
        </div>

        {/* Main Content: Experience, Skills, Availability, Feedback */}
        <div className="col-span-2 p-6 space-y-12  bg-white">
          {/* Experience and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-700">
                Total Experience
              </h3>
              <p className="text-2xl mt-2 text-gray-800">
                {interviewer.experience || "Not specified"}
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-700">
                Interview Pricing
              </h3>
              <p className="text-2xl mt-2 text-gray-800">
                {interviewer.price || "Not specified"}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {interviewer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Availability
            </h2>
            <div className="space-y-4">
              {interviewer.availability.length > 0 ? (
                interviewer.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border-l-4 border-blue-600 shadow-sm rounded-lg"
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
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Feedback
            </h2>
            <div className="space-y-4">
              {interviewer.feedbacks.length > 0 ? (
                interviewer.feedbacks.map((feedback, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border-l-4 border-green-500 shadow-sm rounded-lg"
                  >
                    <p className="text-gray-800">
                      {feedback.feedbackData.comments}
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
