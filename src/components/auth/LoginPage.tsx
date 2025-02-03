import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle, Award, Building2 } from "lucide-react";
import { useMemo } from "react";

const roles = [
  {
    id: "candidate",
    title: "Candidate",
    icon: UserCircle,
    description: "Connect with top interviewers and find your dream job.",
    color: "from-[#0077B5]/10 to-[#004182]/10", // LinkedIn blue tones
    hoverColor: "hover:from-[#0077B5]/20 hover:to-[#004182]/20",
    route: "/candidate-login",
  },
  {
    id: "interviewer",
    title: "Interviewer",
    icon: Award,
    description: "Share your expertise and earn through professional interviews.",
    color: "from-[#0077B5]/10 to-[#004182]/10", // LinkedIn blue tones
    hoverColor: "hover:from-[#0077B5]/20 hover:to-[#004182]/20",
    route: "/interviewer-login",
  },
  {
    id: "corporate",
    title: "Corporate",
    icon: Building2,
    description: "Find the best talent tailored to your organization's needs.",
    color: "from-[#0077B5]/10 to-[#004182]/10", // LinkedIn blue tones
    hoverColor: "hover:from-[#0077B5]/20 hover:to-[#004182]/20",
    route: "/corporate-login",
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    const selectedRole = roles.find((r) => r.id === role);
    if (selectedRole) {
      navigate(selectedRole.route);
    }
  };

  const memoizedRoles = useMemo(() => roles, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 bg-gradient-to-r from-[#0077B5]/10 via-[#004182]/10 to-[#0077B5]/10">
      <div className="max-w-screen-xl px-4 sm:px-6 md:px-8 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center text-[#0077B5] mb-12"
        >
          Choose Your Role
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memoizedRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleRoleSelect(role.id)}
              className={`cursor-pointer group bg-gradient-to-br ${role.color} ${role.hoverColor} p-8 rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
            >
              <role.icon className="w-16 h-16 mb-4 mx-auto text-[#0077B5] group-hover:text-[#004182] transition-colors duration-300" />
              <h3 className="text-2xl font-semibold text-[#0077B5] mb-3">
                {role.title}
              </h3>
              <p className="text-gray-700 text-lg">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};