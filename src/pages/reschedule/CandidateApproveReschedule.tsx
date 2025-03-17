import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, Mail, Calendar, Clock } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";


const CandidateApproveReschedule = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [interviewDetails, setInterviewDetails] = useState<{
    date?: string;
    position?: string;
  }>({});

  const requestId = searchParams.get("requestId");
  const candidateId = searchParams.get("candidateId");

  useEffect(() => {
    const approveReschedule = async () => {
      try {
        const response = await axiosInstance.put(
          "/candidate/approveReschedule",
          { interviewRequestId: requestId, candidateId }
        );

        if (response.data.success) {
          setSuccess(true);
          setInterviewDetails({
            date: response.data.date,
            position: response.data.position,
          });
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to approve reschedule request"
        );
      } finally {
        setLoading(false);
      }
    };

    if (requestId && candidateId) approveReschedule();
  }, [requestId, candidateId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F6F8] space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 border-4 border-[#CFEDFF] rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-[#0A66C2] rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#0A66C2] font-medium text-lg text-center"
        >
          <p>Securing Your Time Slot</p>
          <p className="text-sm text-[#0077B5] mt-1">Processing your request</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-[#F3F6F8] p-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full border border-[#0000001A]">
        <AnimatePresence>
          {success ? (
            <div className="space-y-6 text-center">
              <motion.div
                variants={iconVariants}
                className="flex justify-center"
              >
                <CheckCircle className="w-20 h-20 text-[#0A66C2] mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-[#000000E6]">
                Schedule Confirmed
              </h1>
              
              {interviewDetails.date && (
                <div className="bg-[#F3F6F8] p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-[#CFEDFF] p-3 rounded-lg">
                      <Calendar className="w-8 h-8 text-[#0A66C2]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#666666]">New Interview Date</p>
                      <p className="text-lg font-semibold text-[#000000E6]">
                        {interviewDetails.date}
                      </p>
                    </div>
                  </div>

                  {interviewDetails.position && (
                    <div className="flex items-center gap-4 text-left">
                      <div className="bg-[#CFEDFF] p-3 rounded-lg">
                        <Clock className="w-8 h-8 text-[#0A66C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#666666]">Position</p>
                        <p className="text-lg font-semibold text-[#000000E6]">
                          {interviewDetails.position}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-[#E8F4FF] p-4 rounded-lg flex items-center gap-3">
                <Mail className="w-6 h-6 text-[#0A66C2]" />
                <span className="text-sm text-[#666666]">
                  Confirmation email has been sent to your registered address
                </span>
              </div>

              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <motion.div
                variants={iconVariants}
                className="flex justify-center"
              >
                <XCircle className="w-20 h-20 text-[#C72A0A] mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-[#000000E6]">
                Action Required
              </h1>
              <p className="text-lg text-[#C72A0A] font-medium">{error}</p>

              <div className="bg-[#FFF0ED] p-6 rounded-xl space-y-4 text-left">
                <h3 className="font-semibold text-[#C72A0A]">Next Steps:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#C72A0A]" />
                    <span>Check your email for updates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 text-[#0A66C2]" />
                    <span>Return to dashboard and try again</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C72A0A]" />
                    <span>Contact support@selectskillset.com</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Dashboard
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CandidateApproveReschedule;