import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Phone,
  Star,
  Clock,
  Award,
  Plus,
  AlertCircle,
  DollarSign,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { InterviewerContext } from "../../context/InterviewerContext";
import InterviewerStatistics from "./InterviewerStatistics";
import profileimg from "../../images/interviewerProfile.png";
import InterviewerDashboardSkeletonLoader from "../../components/ui/InterviewerDashboardSkeleton";
import axiosInstance from "../../components/common/axiosConfig";

const InterviewerDashboard = () => {
  const { profile, fetchProfile } = useContext(InterviewerContext);
  const [completion, setCompletion] = useState<{
    totalPercentage: number;
    isComplete: boolean;
    missingSections: { section: string; percentage: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfile();
        const compResponse = await axiosInstance.get(
          "/interviewer/profile-completion"
        );
        setCompletion(compResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load profile data. Please try refreshing the page."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchProfile]);

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
      {completion?.missingSections.slice(0, 2).map((section, index) => (
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
            onClick={() => navigate("/edit-interviewer-profile")}
            className="p-1.5 hover:bg-gray-50 rounded-lg text-blue-600"
          >
            <Plus size={18} />
          </button>
        </div>
      ))}
      {completion?.missingSections.length > 2 && (
        <button className="w-full mt-4 text-blue-600 text-sm hover:bg-gray-50 py-2 rounded-lg">
          View all {completion.missingSections.length} remaining sections
        </button>
      )}
    </motion.div>
  );

  if (loading) return <InterviewerDashboardSkeletonLoader />;
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
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
            >
              <img
                src={profile?.profilePhoto || profileimg}
                alt="Profile"
                className="object-cover w-full h-full rounded-full"
              />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              {profile?.name}
            </h2>
            <p className="text-gray-600 mt-1">{profile?.jobTitle}</p>

            <div className="mt-4 space-y-3 ">
              <div className="flex items-center text-sm text-gray-600 justify-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span>{profile?.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 justify-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{profile?.phoneNumber}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
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
          </div>
          {renderProfileCompletion()}
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-6">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InterviewerStatistics />
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCard
                icon={<Clock size={20} className="text-blue-600" />}
                title="Availability"
                description="Manage your interview slots"
                link="/availability"
              />
              <ActionCard
                icon={<Award size={20} className="text-green-600" />}
                title="Reviews"
                description="View candidate feedback"
                link="/reviews"
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
  if (section.includes("Job Title")) return <Briefcase {...iconProps} />;
  if (section.includes("Experience")) return <Star {...iconProps} />;
  if (section.includes("Price")) return <DollarSign {...iconProps} />;
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

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen flex items-center justify-center text-red-600">
    <AlertCircle className="mr-2" />
    {error}
  </div>
);

export default InterviewerDashboard;
