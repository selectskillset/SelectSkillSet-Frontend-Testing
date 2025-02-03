import { motion } from "framer-motion";

interface Feedback {
  reviewerName: string;
  feedbackText: string;
  rating: number;
  date: string;
}

interface InterviewerFeedbackProps {
  feedbacks: Feedback[];
}

const InterviewerFeedback: React.FC<InterviewerFeedbackProps> = ({ feedbacks }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Feedback</h2>
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback available.</p>
        ) : (
          feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="border-b py-4 last:border-b-0 text-gray-700"
            >
              <h3 className="text-lg font-semibold">{feedback.reviewerName}</h3>
              <p className="text-sm text-gray-500">{feedback.date}</p>
              <div className="mt-2">
                <p>{feedback.feedbackText}</p>
                <div className="mt-2 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`${
                        i < feedback.rating ? "text-yellow-500" : "text-gray-300"
                      } inline-block`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default InterviewerFeedback;
