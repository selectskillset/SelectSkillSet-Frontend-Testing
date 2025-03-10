import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  User,
  Briefcase,
  Star,
  DollarSign,
  CalendarDays,
  Plus,
  CheckCircle,
  Code,
} from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

interface MissingSection {
  section: string;
  percentage: number;
}

const InterviewerProfileCompletion = () => {
  const [completion, setCompletion] = useState<{
    totalPercentage: number;
    isComplete: boolean;
    missingSections: MissingSection[];
  } | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const response = await axiosInstance.get(
          "/interviewer/profile-completion"
        );
        setCompletion(response.data);
      } catch (error) {
        console.error("Error fetching profile completion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, []);

  if (completion?.isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className=" mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center space-x-4 text-green-600">
          <CheckCircle className="w-10 h-10" />
          <h2 className="text-2xl font-semibold">Profile Complete!</h2>
        </div>
        <p className="mt-4 text-gray-600">
          Your profile is 100% complete and visible to potential Candidates.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-3xl mx-auto p-6"
        >
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-10 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-4 mb-6">
            <AlertCircle className="w-10 h-10 text-[#0A66C2]" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Complete Your Profile
            </h2>
          </div>

          <div className="space-y-4">
            <motion.div
              className="bg-gradient-to-r from-[#0A66C2] to-[#64A5FF] h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completion?.totalPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completion?.missingSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-gray-100 p-4 
                             hover:shadow-md transition-all cursor-pointer
                             flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#E9F5FE] rounded-lg flex items-center justify-center">
                      {section.section.includes("Basic") && (
                        <User className="w-6 h-6 text-[#0A66C2]" />
                      )}
                      {section.section.includes("Job Title") && (
                        <Briefcase className="w-6 h-6 text-[#0A66C2]" />
                      )}
                      {section.section.includes("Experience") && (
                        <Star className="w-6 h-6 text-[#0A66C2]" />
                      )}
                      {section.section.includes("Skills") && (
                        <Code className="w-6 h-6 text-[#0A66C2]" />
                      )}
                      {section.section.includes("Price") && (
                        <DollarSign className="w-6 h-6 text-[#0A66C2]" />
                      )}
                      {section.section.includes("Availability") && (
                        <CalendarDays className="w-6 h-6 text-[#0A66C2]" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {section.section}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Complete this section to gain +{section.percentage}%
                    </p>
                  </div>

                  <button
                    className="bg-[#0A66C2] hover:bg-[#064785] 
                               text-white rounded-lg p-2 transition-colors"
                    onClick={() => navigate("/edit-interviewer-profile")}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InterviewerProfileCompletion;
