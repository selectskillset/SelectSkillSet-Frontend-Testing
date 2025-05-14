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
  User,
  Award,
  DollarSign,
  CheckCircle,
  Zap,
  BadgeCheck,
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
  email: string;
  profilePhoto: string;
  jobTitle: string;
  location: string;
  experience: string;
  price: string;
  skills: string[];
  availability: Availability[];
  averageRating: number;
  totalFeedbackCount: number;
  totalInterviews: string;
  summary: string;
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
              i < fullStars
                ? "fill-primary text-primary"
                : hasHalfStar && i === fullStars
                ? "fill-primary/50 text-primary/50"
                : "fill-gray-200 text-gray-200"
            }
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
      toast.success("Interview booked successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });
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
      toast.error(err.response?.data?.message || "Booking failed", {
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⚠️ Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchInterviewer}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </motion.div>
      </div>
    );

  if (!interviewer) return null;

  const formatExperience = (experience: string): string => {
    const yearsMatch = experience.match(/(\d+)\s*yrs/i);
    const monthsMatch = experience.match(/(\d+)\s*mo/i);

    const years = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
    const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 0;

    if (months > 0) {
      return `${years}+`;
    }

    return `${years}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left Column - Profile Card */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Profile Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-32 bg-gradient-to-r from-primary to-primary-dark">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src={interviewer.profilePhoto || "/default-avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {interviewer.averageRating >= 4.5 && (
                      <div className="absolute -bottom-2 -right-2 bg-white  rounded-full shadow-md">
                        <BadgeCheck className="text-primary" size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-20 pb-6 px-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {interviewer.firstName} {interviewer.lastName}
                </h1>
                <p className="text-primary font-medium mt-1">
                  {interviewer.jobTitle}
                </p>
                <div className="flex items-center justify-center mt-4 gap-2 text-gray-600">
                  <MapPin size={16} className="text-primary" />
                  <span>{interviewer.location}</span>
                </div>
                <div className="mt-4 flex justify-center">
                  {renderStars(interviewer.averageRating)}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="text-primary" size={18} />
                Interviewer Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {formatExperience(interviewer.experience)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interviews</p>
                      <p className="font-medium">
                        {interviewer.totalInterviews || "0"} conducted
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rate</p>
                      <p className="font-medium">
                        ${interviewer.price}/session
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {interviewer.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {interviewer.summary}
              </p>
            </motion.div>

            {/* Availability Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  Available Sessions
                </h2>
                <span className="text-gray-500 text-sm">
                  {interviewer.availability.length} slots available
                </span>
              </div>

              {interviewer.availability.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No available slots at the moment. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewer.availability.map((slot) => (
                    <motion.div
                      key={slot._id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 rounded-xl cursor-pointer border border-gray-200 transition-colors"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Calendar size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            {slot.from} - {slot.to}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-primary transition" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase size={20} className="text-primary" />
                  <span className="font-medium">{interviewer.jobTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-medium">
                      {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
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
                  <p className="font-medium text-primary">
                    ${interviewer.price}/session
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookSlot}
                  disabled={isBooking}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <Loader size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Confirm Booking
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewerProfile;
