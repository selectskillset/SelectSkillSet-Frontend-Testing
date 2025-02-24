import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { Check, StarIcon, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";

const steps = [
  "Clarity of Communication",
  "Professionalism",
  "Knowledge of the Role",
  "Engagement and Interest",
  "Interview Structure",
  "Timing",
  "Opportunity to Ask Questions",
  "Behavioral/Technical Questions",
  "Feedback/Next Steps Communication",
  "Overall Experience",
];

const descriptions = [
  "How clear and concise were the interviewer's questions and instructions? Did they effectively communicate what they were looking for?",
  "Was the interviewer polite, respectful, and professional throughout the interaction?",
  "Did the interviewer have a good understanding of the job role and the expectations for the position?",
  "Did the interviewer seem genuinely interested in your responses and engage in a meaningful conversation?",
  "Was the interview organized with a clear structure, such as an introduction, questions, and a closing discussion? Did the process feel efficient?",
  "Was the interview conducted within the expected time frame, or did it feel rushed/dragged on?",
  "Did the interviewer provide ample opportunity for you to ask questions about the role, team, or company?",
  "Were the questions relevant and fair, aligned with the role's requirements, and did they test your skills effectively?",
  "Did the interviewer explain the next steps in the interview process and when you could expect feedback?",
  "How would you rate the overall experience in terms of professionalism, fairness, and insight into the company or role?",
];

const CandidateEvaluationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    steps.reduce((acc, step) => {
      acc[step] = { rating: 0, comments: "" };
      return acc;
    }, {} as Record<string, { rating: number; comments: string }>)
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const { interviewerId, interviewRequestId } = useParams();
  const navigate = useNavigate();

  const handleNext = () => {
    if (
      formData[steps[currentStep]].rating === 0 ||
      !formData[steps[currentStep]].comments
    ) {
      toast.error("Please provide a rating and comments before proceeding.");
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [steps[currentStep]]: {
        ...prev[steps[currentStep]],
        rating,
      },
    }));
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [steps[currentStep]]: {
        ...prev[steps[currentStep]],
        comments: e.target.value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!interviewerId || !interviewRequestId) {
      toast.error("Invalid candidate ID.");
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post("/candidate/add-interviewer-feedback", {
        interviewerId,
        interviewRequestId,
        feedback: formData,
      });
      toast.success("Candidate feedback submitted successfully!");
      setShowConfirmModal(false);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-[#f3f2ef] p-4 flex items-center justify-center"
          >
            {showPopup && (
              <div
                onClick={(e) =>
                  (e.target as HTMLElement).classList.contains(
                    "popup-container"
                  ) && setShowPopup(false)
                }
                className="popup-container fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              >
                <div className="relative bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-xl">
                  <h2 className="text-2xl font-semibold text-[#0a66c2] mb-4">
                  interviewer Evaluation Instructions
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                  interviewer evaluation forms are to be completed by the
                    candidate to rank the interviewer’s overall performance
                    during the interview. Use the following scale for your
                    evaluation:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>
                      <strong>5 – Exceptional:</strong> Outstanding
                      capabilities.
                    </li>
                    <li>
                      <strong>4 – Above Average:</strong> Exceeds expectations.
                    </li>
                    <li>
                      <strong>3 – Average:</strong> Meets expectations.
                    </li>
                    <li>
                      <strong>2 – Satisfactory:</strong> Acceptable performance.
                    </li>
                    <li>
                      <strong>1 – Unsatisfactory:</strong> Below requirements.
                    </li>
                  </ul>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#084694]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white w-full max-w-3xl shadow-xl rounded-lg overflow-hidden">
              <div className="p-6 relative">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                interviewer Evaluation Form
                </h1>
                <button
                  onClick={() => setShowPopup(true)}
                  className="absolute top-4 right-4 text-[#0a66c2] hover:text-[#084694]"
                >
                  <Info size={24} />
                </button>

                {/* Step Indicator */}
                <div className="flex justify-center gap-2 overflow-x-auto mb-8">
                  {steps.map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer ${
                          index === currentStep
                            ? "bg-[#0a66c2] text-white"
                            : completedSteps.includes(index)
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => handleStepClick(index)}
                      >
                        {completedSteps.includes(index) ? (
                          <Check size={20} />
                        ) : (
                          index + 1
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-lg font-semibold text-gray-700">
                  {steps[currentStep]}
                </h2>
                <p className="text-gray-600 mt-2">
                  {descriptions[currentStep]}
                </p>

                <div className="mt-6">
                  <label className="block text-gray-600 font-medium">
                    Rating
                  </label>
                  <div className="flex gap-3 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${
                          formData[steps[currentStep]].rating >= star
                            ? "bg-yellow-500 text-white shadow-md shadow-yellow-400 border-yellow-400"
                            : "bg-white border-gray-300 hover:border-yellow-500"
                        }`}
                      >
                        <StarIcon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-gray-600 font-medium">
                    Comments
                  </label>
                  <textarea
                    value={formData[steps[currentStep]].comments}
                    onChange={handleCommentsChange}
                    placeholder="Enter your comments here"
                    className="w-full mt-3 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#0a66c2]"
                  />
                </div>

                <div className="flex justify-between mt-10">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#084694]"
                  >
                    {currentStep < steps.length - 1 ? "Next" : "Submit"}
                  </button>
                </div>
              </div>
            </div>

            {/* Loader Spinner */}
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid border-current border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
              <div
                onClick={(e) =>
                  (e.target as HTMLElement).classList.contains(
                    "popup-container"
                  ) && setShowConfirmModal(false)
                }
                className="popup-container fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              >
                <div className="relative bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-xl">
                  <h2 className="text-2xl font-semibold text-[#0a66c2] mb-4">
                    Confirm Submission
                  </h2>
                  <div className="overflow-y-auto max-h-80">
                    {steps.map((step, index) => (
                      <div key={index} className="mb-3">
                        <p className="font-semibold">{step}</p>
                        <p>Rating: {formData[step].rating}</p>
                        <p>Comments: {formData[step].comments}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-[#0a66c2] text-white rounded-lg hover:bg-[#084694]"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </>
  );
};

export default CandidateEvaluationForm;
