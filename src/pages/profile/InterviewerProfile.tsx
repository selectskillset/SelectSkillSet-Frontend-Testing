import { useEffect, useState, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
  RefreshCw,
  Mail,
  Hourglass,
  EuroIcon,
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

interface BookingResponse {
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';
  interviewId?: string;
}

const LoadingState = memo(() => (
  <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="animate-spin text-primary w-8 h-8" />
      <span className="text-gray-600">Loading interviewer profile...</span>
    </div>
  </div>
));

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

  const renderStars = useCallback((rating: number) => {
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
      </div>
    );
  }, []);

  const handleBookSlot = async () => {
    if (!selectedSlot || !interviewer) return;
    setIsBooking(true);
    
    try {
      const response = await axiosInstance.post<BookingResponse>("/candidate/schedule", {
        interviewerId: id,
        date: selectedSlot.date,
        price: interviewer.price,
        from: selectedSlot.from,
        to: selectedSlot.to,
      });

      const { message, status, interviewId } = response.data;

      toast.info(
        "Interview request sent!",
        {
          description: "Please wait for the interviewer to respond.",
          icon: <Mail className="text-blue-500" size={15} />,
          duration: 5000,
        }
      );

      setSelectedSlot(null);
    } catch (err) {
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <span className="font-medium">Booking Failed</span>
          </div>
          <p className="text-sm text-gray-600">
            {err.response?.data?.message || "An error occurred while processing your request"}
          </p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatTimeRange = useCallback((from: string, to: string) => {
    return `${from} - ${to}`;
  }, []);

  if (loading) return <LoadingState />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⚠️ Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchInterviewer}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </motion.div>
      </div>
    );

  if (!interviewer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={interviewer.profilePhoto || "/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md object-cover"
                loading="lazy"
              />
              {interviewer.averageRating >= 4.5 && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-md p-1">
                  <BadgeCheck className="text-primary" size={20} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {interviewer.firstName} {interviewer.lastName}
              </h1>
              <p className="text-primary font-medium mt-1 text-lg">
                {interviewer.jobTitle}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={16} className="text-primary" />
                  <span>{interviewer.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(interviewer.averageRating)}
                  <span className="text-sm text-gray-600 ml-2">
                    ({interviewer.totalFeedbackCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {interviewer.summary}
              </p>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {interviewer.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="text-primary" size={18} />
                Interviewer Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">
                      {interviewer.experience?.split(" ")[0]}+
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Interviews Conducted
                    </p>
                    <p className="font-medium">
                      {interviewer.totalInterviews || "0"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <EuroIcon className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session Rate</p>
                    <p className="font-medium">€{interviewer.price}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Availability Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="text-primary" size={18} />
                  Available Sessions
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {interviewer.availability.length} available
                </span>
              </div>

              {interviewer.availability.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No available slots at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviewer.availability.map((slot) => (
                    <motion.div
                      key={slot._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedSlot?._id === slot._id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(slot.date)}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Clock size={14} className="text-primary" />
                            {formatTimeRange(slot.from, slot.to)}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-primary"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
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
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
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
                    €{interviewer.price}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-3">
                  <Mail className="text-blue-500 mt-0.5" size={25} />
                  <p className="text-sm text-gray-700">
                    This will send a request to {interviewer.firstName}. You'll receive an email confirmation once they accept your booking.
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookSlot}
                    disabled={isBooking}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {isBooking ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewerProfile;