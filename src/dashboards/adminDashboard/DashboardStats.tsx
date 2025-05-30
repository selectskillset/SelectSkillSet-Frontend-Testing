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
      icon: <Users className="w-6 h-6 text-white" />,
      type: "candidates",
    },
    {
      label: "Total Interviewers",
      value: totalInterviewers,
      color: "bg-purple-50",
      iconColor: "bg-purple-500",
      icon: <Briefcase className="w-6 h-6 text-white" />,
      type: "interviewers",
    },
    {
      label: "Total Corporates",
      value: totalCorporates,
      color: "bg-green-50",
      iconColor: "bg-green-500",
      icon: <Building className="w-6 h-6 text-white" />,
      type: "corporates",
    },
    {
      label: "Pending Interviews",
      value: pendingCount,
      color: "bg-yellow-50",
      iconColor: "bg-yellow-500",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.3 }}
          className={`relative p-6 rounded-2xl shadow-sm hover:shadow-lg cursor-pointer overflow-hidden group ${stat.color}`}
          onClick={() =>
            stat.type && navigate(`/admin/table?userType=${stat.type}`)
          }
          aria-label={`View ${stat.label}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              stat.type && navigate(`/admin/table?userType=${stat.type}`);
            }
          }}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-${stat.iconColor.replace(
              "bg-",
              ""
            )}/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Left Side */}
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>

            {/* Icon */}
            <div
              className={`p-3 rounded-lg ${stat.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}
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
