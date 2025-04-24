import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/ui/Loader";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Availability {
  date: string;
  from: string;
  to: string;
  _id: string;
}

interface Interviewer {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  jobTitle: string;
  location: string;
  experience: string;
  price: string;
  skills: string[];
  availability: Availability[];
  averageRating: number;
  totalFeedbackCount: number;
}

const InterviewerProfile = () => {
  const { id } = useParams();
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const fetchInterviewer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Interviewer>(
        `/candidate/getInterviewerProfile/${id}`
      );
      setInterviewer(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching interviewer profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInterviewer();
  }, [fetchInterviewer]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < fullStars || (hasHalfStar && i === fullStars)
                ? "text-[#0A66C2]"
                : "text-gray-300"
            }
            fill={
              i < fullStars
                ? "#0A66C2"
                : hasHalfStar && i === fullStars
                ? "#0A66C2"
                : "transparent"
            }
            strokeWidth={1.5}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">
          ({interviewer?.totalFeedbackCount} reviews)
        </span>
      </div>
    );
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !interviewer) return;
    setIsBooking(true);
    try {
      await axiosInstance.post("/candidate/schedule", {
        interviewerId: id,
        date: selectedSlot.date,
        price: interviewer.price,
        from: selectedSlot.from,
        to: selectedSlot.to,
      });
      toast.success("Interview booked successfully!");
      setInterviewer((prev) =>
        prev
          ? {
              ...prev,
              availability: prev.availability.filter(
                (s) => s._id !== selectedSlot._id
              ),
            }
          : null
      );
      setSelectedSlot(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⚠️ Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchInterviewer}
            className="px-6 py-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#004182] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!interviewer) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Profile Header */}
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Card */}
            <div className="w-full md:w-80 flex-shrink-0 bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col items-center">
                <img
                  src={interviewer.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                />
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                  {interviewer.firstName} {interviewer.lastName}
                </h1>
                <p className="text-gray-600 text-center mt-2">
                  {interviewer.jobTitle}
                </p>
                <div className="flex items-center mt-4 gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{interviewer.location}</span>
                </div>
                <div className="mt-4 w-full">
                  {renderStars(interviewer.averageRating)}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Skills Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {interviewer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Sessions
                  </h2>
                  <span className="text-gray-500 text-sm">
                    {interviewer.availability.length} slots available
                  </span>
                </div>
                <div className="space-y-4">
                  {interviewer.availability.map((slot) => (
                    <motion.div
                      key={slot._id}
                      whileHover={{ y: -2 }}
                      className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-[#0A66C2]/5 rounded-xl cursor-pointer border border-gray-200"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Calendar size={20} className="text-[#0A66C2]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock size={16} />
                            {slot.from} - {slot.to}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-[#0A66C2] transition" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase size={20} className="text-[#0A66C2]" />
                  <span className="font-medium">{interviewer.jobTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-medium">
                      {new Date(selectedSlot.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-medium">
                      {selectedSlot.from} - {selectedSlot.to}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="font-medium text-[#0A66C2]">
                    ${interviewer.price}/session
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookSlot}
                  disabled={isBooking}
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] disabled:opacity-50"
                >
                  {isBooking ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewerProfile;
