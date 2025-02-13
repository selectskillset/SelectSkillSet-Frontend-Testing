import { motion } from "framer-motion";
import { Users, Briefcase, Building, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStatsProps {
  totalCandidates: number;
  totalInterviewers: number;
  totalCorporates: number;
  pendingCount: number;
}

const DashboardStats = ({
  totalCandidates,
  totalInterviewers,
  totalCorporates,
  pendingCount,
}: DashboardStatsProps) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Candidates",
      value: totalCandidates,
      color: "bg-blue-50",
      iconColor: "bg-blue-500",
      icon: <Users className="w-5 h-5 text-white" />,
      type: "candidates",
    },
    {
      label: "Total Interviewers",
      value: totalInterviewers,
      color: "bg-purple-50",
      iconColor: "bg-purple-500",
      icon: <Briefcase className="w-5 h-5 text-white" />,
      type: "interviewers",
    },
    {
      label: "Total Corporates",
      value: totalCorporates,
      color: "bg-green-50",
      iconColor: "bg-green-500",
      icon: <Building className="w-5 h-5 text-white" />,
      type: "corporates",
    },
    {
      label: "Pending Interviews",
      value: pendingCount,
      color: "bg-orange-50",
      iconColor: "bg-orange-500",
      icon: <Clock className="w-5 h-5 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`group p-5 ${stat.color} shadow-xs hover:shadow-md transition-all duration-300 ease-out border-gray-100/50 rounded-xl shadow-lg border border-gray-100 hover:border-gray-100 cursor-pointer`}
          onClick={() => stat.type && navigate(`/admin/dashboard/table?userType=${stat.type}`)}
          aria-label={`View ${stat.label}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div
              className={`p-3 rounded-xl ${stat.iconColor} shadow-sm group-hover:shadow-md transition-shadow`}
            >
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;