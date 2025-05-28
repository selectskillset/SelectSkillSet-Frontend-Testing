import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
} from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";

const CandidateApproveReschedule = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [interviewDetails, setInterviewDetails] = useState<{
    date?: string;
    position?: string;
  }>({});

  const requestId = searchParams.get("requestId");
  const candidateId = searchParams.get("candidateId");

  useEffect(() => {
    const handleRescheduleApproval = async () => {
      try {
        const { data } = await axiosInstance.put(
          "/candidate/approveReschedule",
          {
            interviewRequestId: requestId,
            candidateId,
          }
        );

        if (data.success) {
          setStatus("success");
          setInterviewDetails({
            date: data.date,
            position: data.position,
          });
          return;
        }
        throw new Error("Failed to approve reschedule");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to approve reschedule request"
        );
      }
    };

    if (requestId && candidateId) {
      handleRescheduleApproval();
    } else {
      setStatus("error");
      setErrorMessage("Invalid request");
    }
  }, [requestId, candidateId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-primary rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-1"
        >
          <p className="text-primary font-medium text-lg">
            Securing Your Time Slot
          </p>
          <p className="text-muted-foreground text-sm">
            Processing your request
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-2xl w-full border border-border">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <motion.div
                variants={iconVariants}
                className="flex justify-center"
              >
                <CheckCircle className="w-20 h-20 text-primary mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-foreground">
                Schedule Confirmed
              </h1>

              {interviewDetails.date && (
                <div className="bg-muted p-6 rounded-xl space-y-4">
                  <InfoItem
                    icon={<Calendar className="w-8 h-8 text-primary" />}
                    label="New Interview Date"
                    value={interviewDetails.date}
                  />
                  {interviewDetails.position && (
                    <InfoItem
                      icon={<Clock className="w-8 h-8 text-primary" />}
                      label="Position"
                      value={interviewDetails.position}
                    />
                  )}
                </div>
              )}

              <div className="bg-primary/10 p-4 rounded-lg flex items-center gap-3 text-primary">
                <Mail className="w-6 h-6" />
                <span className="text-sm">
                  Confirmation email has been sent to your registered address
                </span>
              </div>

              <ActionButton
                onClick={() => navigate("/")}
                icon={<ArrowLeft className="w-5 h-5" />}
                label="Return to Dashboard"
              />
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <motion.div
                variants={iconVariants}
                className="flex justify-center"
              >
                <XCircle className="w-20 h-20 text-secondary mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-foreground">
                Action Required
              </h1>
              <p className="text-lg text-secondary font-medium">
                {errorMessage}
              </p>

              <div className="bg-secondary/10 p-6 rounded-xl space-y-4 text-left text-foreground">
                <h3 className="font-semibold">Next Steps:</h3>
                <ul className="space-y-3">
                  <InfoListItem
                    icon={<Mail className="w-5 h-5 text-secondary" />}
                    text="Check your email for updates"
                  />
                  <InfoListItem
                    icon={<ArrowLeft className="w-5 h-5 text-primary" />}
                    text="Return to dashboard and try again"
                  />
                  <InfoListItem
                    icon={<Clock className="w-5 h-5 text-secondary" />}
                    text="Contact support@selectskillset.com"
                  />
                </ul>
              </div>

              <ActionButton
                onClick={() => navigate("/")}
                icon={<ArrowLeft className="w-5 h-5" />}
                label="Return to Dashboard"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Reusable Components
const InfoItem = React.memo(
  ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center gap-4 text-left">
      <div className="bg-primary/20 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
);

const InfoListItem = React.memo(
  ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <li className="flex items-center gap-3">
      {icon}
      <span>{text}</span>
    </li>
  )
);

const ActionButton = React.memo(
  ({
    onClick,
    icon,
    label,
  }: {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className="mt-6 text-white bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto"
    >
      {icon}
      {label}
    </button>
  )
);

export default CandidateApproveReschedule;
