import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {toast} from "sonner";
import axiosInstance from "../../components/common/axiosConfig";
import { Check, Star, Info, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";

const steps = [
  "Educational Background",
  "Prior Work Experience",
  "Technical Qualifications",
  "Verbal Communication",
  "Candidate Interest",
  "Organization Knowledge",
  "Team Skills",
  "Initiative",
  "Time Management",
  "Customer Service",
  "Final Recommendation",
];

const descriptions = [
  "Evaluate candidate's educational qualifications and relevant training",
  "Assess previous work experience and acquired skills",
  "Judge technical capabilities and skill proficiency",
  "Evaluate clarity and effectiveness of communication",
  "Measure enthusiasm and interest in the role",
  "Assess preparation and company knowledge",
  "Evaluate collaboration and interpersonal skills",
  "Judge proactive approach and self-motivation",
  "Assess organizational skills and deadline management",
  "Evaluate client service orientation",
  "Summarize strengths, weaknesses, and hiring recommendation",
];

interface FormState {
  [key: string]: {
    rating: number;
    comments: string;
  };
}

const InterviewEvaluationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(
    steps.reduce((acc, step) => {
      acc[step] = { rating: 0, comments: "" };
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
    setCurrentStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const current = formData[steps[currentStep]];
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

    if (currentStep === steps.length - 1) {
      setShowConfirmation(true);
    } else {
      handleNavigation("next");
    }
  }, [currentStep, handleNavigation, validateCurrentStep]);

  const handleRatingChange = useCallback(
    (rating: number) => {
      setFormData((prev) => ({
        ...prev,
        [steps[currentStep]]: { ...prev[steps[currentStep]], rating },
      }));
    },
    [currentStep]
  );

  const handleCommentsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [steps[currentStep]]: {
          ...prev[steps[currentStep]],
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
      navigate("/", { replace: true });
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
      } else if (e.key === "ArrowRight" && currentStep < steps.length - 1) {
        handleNavigation("next");
      }
    };

    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [currentStep, handleNavigation]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <AnimatePresence>
        {showGuidelines && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowGuidelines(false)}
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
                  onClick={() => setShowGuidelines(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Please rate candidates using the following scale:
                </p>
                <ul className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <li key={rating} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        {rating}
                      </div>
                      <span className="font-medium">
                        {
                          [
                            "Exceptional - Outstanding performance",
                            "Above Average - Exceeds expectations",
                            "Average - Meets requirements",
                            "Satisfactory - Needs improvement",
                            "Unsatisfactory - Below standards",
                          ][5 - rating]
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100"
            >
              <Info size={20} />
            </button>
          </div>

          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentStep === index
                      ? "bg-blue-100 text-blue-600"
                      : completedSteps.includes(index)
                      ? "bg-green-100 text-green-600"
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

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {steps[currentStep]}
                </h3>
                <p className="text-gray-600 mt-2">
                  {descriptions[currentStep]}
                </p>
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
                        onClick={() => handleRatingChange(rating)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                          formData[steps[currentStep]].rating >= rating
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-gray-100 text-gray-400 hover:bg-blue-50"
                        }`}
                      >
                        <Star
                          size={20}
                          fill={
                            formData[steps[currentStep]].rating >= rating
                              ? "currentColor"
                              : "none"
                          }
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
                    value={formData[steps[currentStep]].comments}
                    onChange={handleCommentsChange}
                    placeholder="Provide specific examples and observations..."
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    rows={4}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => handleNavigation("prev")}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={handleStepProgress}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              {currentStep === steps.length - 1 ? (
                "Review and Submit"
              ) : (
                <>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showConfirmation && (
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
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{step}</h3>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Star
                        size={16}
                        className={`${
                          formData[step].rating >= 3
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                        fill="currentColor"
                      />
                      <span
                        className={`font-medium ${
                          formData[step].rating >= 3
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {formData[step].rating}/5
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {formData[step].comments}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Edit Evaluation
                </button>
                <button
                  onClick={submitEvaluation}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-75 flex items-center gap-2"
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
    </div>
  );
};

export default InterviewEvaluationForm;
