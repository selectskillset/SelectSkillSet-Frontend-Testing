import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axiosInstance from "../../components/common/axiosConfig";
import { Check, Star, Info, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";

// Color Constants
const COLORS = {
  primary: "#4338CA",
  primaryLight: "#6366F1",
  primaryDark: "#3730A3",
  secondary: "#7C3AED",
  secondaryLight: "#A78BFA",
  secondaryDark: "#5B21B6",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  star: "#F59E0B",
};

// Evaluation Steps Data
const EVALUATION_STEPS = [
  {
    title: "Educational Background",
    description: "Evaluate candidate's educational qualifications and relevant training",
  },
  {
    title: "Prior Work Experience",
    description: "Assess previous work experience and acquired skills",
  },
  {
    title: "Technical Qualifications",
    description: "Judge technical capabilities and skill proficiency",
  },
  {
    title: "Verbal Communication",
    description: "Evaluate clarity and effectiveness of communication",
  },
  {
    title: "Candidate Interest",
    description: "Measure enthusiasm and interest in the role",
  },
  {
    title: "Organization Knowledge",
    description: "Assess preparation and company knowledge",
  },
  {
    title: "Team Skills",
    description: "Evaluate collaboration and interpersonal skills",
  },
  {
    title: "Initiative",
    description: "Judge proactive approach and self-motivation",
  },
  {
    title: "Time Management",
    description: "Assess organizational skills and deadline management",
  },
  {
    title: "Customer Service",
    description: "Evaluate client service orientation",
  },
  {
    title: "Final Recommendation",
    description: "Summarize strengths, weaknesses, and hiring recommendation",
  },
];

const RATING_LABELS = [
  "Exceptional - Outstanding performance",
  "Above Average - Exceeds expectations",
  "Average - Meets requirements",
  "Satisfactory - Needs improvement",
  "Unsatisfactory - Below standards",
];

interface FormState {
  [key: string]: {
    rating: number;
    comments: string;
  };
}

const InterviewEvaluationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(() =>
    EVALUATION_STEPS.reduce((acc, step) => {
      acc[step.title] = { rating: 0, comments: "" };
      return acc;
    }, {} as FormState)
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { candidateId, interviewRequestId } = useParams();

  const handleNavigation = useCallback((direction: "next" | "prev") => {
    setCurrentStep((prev) => {
      const newStep = direction === "next" ? prev + 1 : prev - 1;
      return Math.max(0, Math.min(newStep, EVALUATION_STEPS.length - 1));
    });
  }, []);

  const validateCurrentStep = useCallback(() => {
    const current = formData[EVALUATION_STEPS[currentStep].title];
    if (current.rating === 0 || current.comments.trim() === "") {
      toast.error("Please complete all fields before continuing");
      return false;
    }
    return true;
  }, [currentStep, formData]);

  const handleStepProgress = useCallback(() => {
    if (!validateCurrentStep()) return;

    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );

    if (currentStep === EVALUATION_STEPS.length - 1) {
      setShowConfirmation(true);
    } else {
      handleNavigation("next");
    }
  }, [currentStep, handleNavigation, validateCurrentStep]);

  const handleRatingChange = useCallback(
    (rating: number) => {
      setFormData((prev) => ({
        ...prev,
        [EVALUATION_STEPS[currentStep].title]: {
          ...prev[EVALUATION_STEPS[currentStep].title],
          rating,
        },
      }));
    },
    [currentStep]
  );

  const handleCommentsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [EVALUATION_STEPS[currentStep].title]: {
          ...prev[EVALUATION_STEPS[currentStep].title],
          comments: e.target.value,
        },
      }));
    },
    [currentStep]
  );

  const submitEvaluation = useCallback(async () => {
    if (!candidateId || !interviewRequestId) {
      toast.error("Invalid evaluation parameters");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/interviewer/add-candidate-feedback", {
        candidateId,
        interviewRequestId,
        feedback: formData,
      });
      toast.success("Evaluation submitted successfully!");
      navigate("/interviewer-dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [candidateId, interviewRequestId, formData, navigate]);

  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentStep > 0) {
        handleNavigation("prev");
      } else if (e.key === "ArrowRight" && currentStep < EVALUATION_STEPS.length - 1) {
        handleNavigation("next");
      }
    };

    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [currentStep, handleNavigation]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <GuidelinesModal
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Candidate Evaluation
            </h1>
            <button
              onClick={() => setShowGuidelines(true)}
              className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Info size={20} />
            </button>
          </div>

          <ProgressIndicator
            steps={EVALUATION_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={setCurrentStep}
          />

          <AnimatePresence mode="wait">
            <FormStep
              key={currentStep}
              step={EVALUATION_STEPS[currentStep]}
              formData={formData}
              onRatingChange={handleRatingChange}
              onCommentsChange={handleCommentsChange}
            />
          </AnimatePresence>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={EVALUATION_STEPS.length}
            onPrev={() => handleNavigation("prev")}
            onNext={handleStepProgress}
          />
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmation}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={() => setShowConfirmation(false)}
        onSubmit={submitEvaluation}
      />
    </div>
  );
};

// Sub-components
const GuidelinesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Evaluation Guidelines
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Please rate the candidate using the following scale:
            </p>
            <ul className="space-y-3">
              {RATING_LABELS.map((label, index) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    {5 - index}
                  </div>
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProgressIndicator: React.FC<{
  steps: typeof EVALUATION_STEPS;
  currentStep: number;
  completedSteps: number[];
  onStepClick: (index: number) => void;
}> = ({ steps, currentStep, completedSteps, onStepClick }) => (
  <div className="mb-8 overflow-x-auto filter-chips pb-2">
    <div className="flex gap-2">
      {steps.map((step, index) => (
        <button
          key={step.title}
          onClick={() => onStepClick(index)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            currentStep === index
              ? "bg-primary/10 text-primary"
              : completedSteps.includes(index)
              ? "bg-success/10 text-success"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {completedSteps.includes(index) ? (
            <span className="flex items-center gap-2">
              <Check size={14} /> {index + 1}
            </span>
          ) : (
            `Step ${index + 1}`
          )}
        </button>
      ))}
    </div>
  </div>
);

const FormStep: React.FC<{
  step: typeof EVALUATION_STEPS[number];
  formData: FormState;
  onRatingChange: (rating: number) => void;
  onCommentsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ step, formData, onRatingChange, onCommentsChange }) => {
  const currentData = formData[step.title];

  return (
    <motion.div
      key={step.title}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
        <p className="text-gray-600 mt-2">{step.description}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Performance Rating
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingChange(rating)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  currentData.rating >= rating
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-400 hover:bg-primary/10"
                }`}
              >
                <Star
                  size={20}
                  fill={currentData.rating >= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Detailed Feedback
          </label>
          <textarea
            value={currentData.comments}
            onChange={onCommentsChange}
            placeholder="Provide specific examples and observations..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            rows={4}
          />
        </div>
      </div>
    </motion.div>
  );
};

const FormNavigation: React.FC<{
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ currentStep, totalSteps, onPrev, onNext }) => (
  <div className="mt-10 flex items-center justify-between">
    <button
      onClick={onPrev}
      disabled={currentStep === 0}
      className="px-4 py-2 text-gray-600 hover:text-primary disabled:opacity-50 flex items-center gap-2 transition-colors"
    >
      <ChevronLeft size={18} />
      <span className="hidden sm:inline">Previous</span>
    </button>

    <div className="text-sm text-gray-500">
      {currentStep + 1} of {totalSteps}
    </div>

    <button
      onClick={onNext}
      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark flex items-center gap-2 transition-colors"
    >
      {currentStep === totalSteps - 1 ? (
        "Review and Submit"
      ) : (
        <>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </>
      )}
    </button>
  </div>
);

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  formData: FormState;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ isOpen, formData, isSubmitting, onClose, onSubmit }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm Evaluation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {Object.entries(formData).map(([step, data]) => (
              <div key={step} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{step}</h3>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Star
                    size={16}
                    className={data.rating >= 3 ? "text-success" : "text-warning"}
                    fill="currentColor"
                  />
                  <span className={data.rating >= 3 ? "text-success" : "text-warning"}>
                    {data.rating}/5
                  </span>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {data.comments}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Edit Evaluation
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark disabled:opacity-75 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4" />
                  Submitting...
                </>
              ) : (
                "Confirm Submission"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default React.memo(InterviewEvaluationForm);