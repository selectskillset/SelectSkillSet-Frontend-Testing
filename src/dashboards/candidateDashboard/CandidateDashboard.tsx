import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCandidateContext } from "../../context/CandidateContext";
import CandidateStatistics from "./CandidateStatistics";
import axiosInstance from "../../components/common/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Star,
  Plus,
  CalendarDays,
  Award,
} from "lucide-react";

const CandidateDashboard: React.FC = () => {
  const { profile, isLoading, fetchProfile, error } = useCandidateContext();
  const [completion, setCompletion] = useState<{
    totalPercentage: number;
    isComplete: boolean;
    missingSections: MissingSection[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) await fetchProfile();
      try {
        const response = await axiosInstance.get(
          "/candidate/profile-completion"
        );
        setCompletion(response.data);
      } catch (error) {
        console.error("Error fetching completion data:", error);
      }
    };
    fetchData();
  }, [profile, fetchProfile]);

  const renderProfileDetails = useCallback(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Profile Details
        </h3>
        <div className="space-y-3">
          {[
            { label: "Email", value: profile?.email || "Not provided" },
            { label: "Location", value: profile?.location || "Not provided" },
            { label: "Phone", value: profile?.phoneNumber || "Not provided" },
            {
              label: "LinkedIn",
              value: profile?.linkedIn ? (
                <a
                  href={profile.linkedIn}
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              ) : (
                "Not provided"
              ),
            },
            {
              label: "Resume",
              value: profile?.resume ? (
                <a
                  href={profile.resume}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
              ) : (
                "Not provided"
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    ),
    [profile]
  );

  const renderProfileCompletion = () => (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Profile Strength</h3>
        <span className="text-blue-600 font-medium">
          {completion?.totalPercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${completion?.totalPercentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      {completion?.missingSections.slice(0, 3).map((section, index) => (
        <div key={index} className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <SectionIcon section={section.section} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {section.section}
              </p>
              <p className="text-xs text-gray-500">+{section.percentage}%</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/edit-candidate-profile")}
            className="p-1.5 hover:bg-gray-50 rounded-lg text-blue-600"
          >
            <Plus size={18} />
          </button>
        </div>
      ))}
      {completion?.missingSections.length > 3 && (
        <button className="w-full mt-4 text-blue-600 text-sm hover:bg-gray-50 py-2 rounded-lg">
          View all {completion.missingSections.length} remaining sections
        </button>
      )}
    </motion.div>
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <img
              src={profile?.profilePhoto || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              {profile?.name || "Unknown User"}
            </h2>
            <p className="text-gray-600 mt-1">
              {profile?.jobTitle || "No title provided"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {profile?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {renderProfileCompletion()}
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-6">
          {renderProfileDetails()}
          <CandidateStatistics />
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2  gap-4">
            
              <ActionCard
                icon={<CalendarDays size={24} className="text-orange-600" />}
                title="Schedule Interviews"
                description="Book mock interviews with experts"
                link="/candidate-schedule-interviews"
              />
              <ActionCard
                icon={<Award size={24} className="text-purple-600" />}
                title="Skill Assessment"
                description="Test your technical competencies"
                link="/skill-assessment"
              />
            </div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

const SectionIcon = ({ section }: { section: string }) => {
  const iconProps = { size: 20, className: "text-blue-600" };
  if (section.includes("Basic")) return <User {...iconProps} />;
  if (section.includes("Resume")) return <FileText {...iconProps} />;
  if (section.includes("Work")) return <Briefcase {...iconProps} />;
  if (section.includes("Skills")) return <Star {...iconProps} />;
  return <AlertCircle {...iconProps} />;
};

const ActionCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => (
  <Link
    to={link}
    className="p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

const LoadingState = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-pulse space-y-6 w-96">
      <div className="h-32 bg-gray-200 rounded-xl" />
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="h-screen flex items-center justify-center text-red-600">
    <AlertCircle size={24} className="mr-2" />
    {error}
  </div>
);

export default CandidateDashboard;
