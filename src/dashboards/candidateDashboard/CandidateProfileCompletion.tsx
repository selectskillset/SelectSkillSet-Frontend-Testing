import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Linkedin,
  FileText,
  User,
  Briefcase,
  Star,
  Plus,
  CheckCircle,
  Rocket,
  Eye,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

interface MissingSection {
  section: string;
  percentage: number;
}

const CandidateProfileCompletion = () => {
  const [completion, setCompletion] = useState<{
    totalPercentage: number;
    isComplete: boolean;
    missingSections: MissingSection[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "/candidate/profile-completion"
        );
        setCompletion(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded-full w-1/2" />
          <div className="h-4 bg-gray-200 rounded-full w-3/4" />
          <div className="h-2.5 bg-gray-200 rounded-full" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          Your profile is 100% complete and visible to potential Corporates
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <AlertCircle className="w-8 h-8 text-[#0A66C2] mr-4" />
            Complete Your Profile
          </h2>
          <span className="text-gray-600 font-medium text-lg">
            {completion?.totalPercentage}% Complete
          </span>
        </div>

        <motion.div
          className="w-full bg-gray-200 rounded-full h-3"
          initial={{ width: 0 }}
          animate={{ width: `${completion?.totalPercentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-[#0A66C2] to-[#64A5FF] h-full rounded-full" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {completion?.missingSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg border border-gray-100 p-5 
                       hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-[#E9F5FE] rounded-lg flex items-center justify-center">
                  {section.section.includes("Basic") && (
                    <User className="w-7 h-7 text-[#0A66C2]" />
                  )}
                  {section.section.includes("Photo") && (
                    <User className="w-7 h-7 text-[#0A66C2]" />
                  )}
                  {section.section.includes("Resume") && (
                    <FileText className="w-7 h-7 text-[#0A66C2]" />
                  )}
                  {section.section.includes("Work") && (
                    <Briefcase className="w-7 h-7 text-[#0A66C2]" />
                  )}
                  {section.section.includes("Skills") && (
                    <Star className="w-7 h-7 text-[#0A66C2]" />
                  )}
                  {section.section.includes("LinkedIn") && (
                    <Linkedin className="w-7 h-7 text-[#0A66C2]" />
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
                onClick={() => navigate("/edit-candidate-profile")}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#FFF7E0] border border-[#FFD500] rounded-lg p-4 text-sm text-[#6A5B00]">
        A complete profile increases your chances of being noticed by employers
        by 80%
      </div>
    </motion.div>
  );
};

export default CandidateProfileCompletion;
