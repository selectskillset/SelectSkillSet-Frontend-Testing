import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { UserCircle, Award, Building2 } from "lucide-react";

const LINKEDIN_COLORS = {
  primary: "#0077B5",
  dark: "#004182",
  light: "#00A0DC",
};

const roles = [
  {
    id: "candidate",
    title: "Candidate",
    icon: UserCircle,
    description: "Connect with top interviewers and find your dream job",
    cta: "Find Opportunities",
    route: "/candidate-login",
  },
  {
    id: "interviewer",
    title: "Interviewer",
    icon: Award,
    description: "Share expertise & earn through professional interviews",
    cta: "Start Interviewing",
    route: "/interviewer-login",
  },
  {
    id: "corporate",
    title: "Corporate",
    icon: Building2,
    description: "Find pre-vetted talent tailored to your needs",
    cta: "Hire Talent",
    route: "/corporate-login",
  },
];

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center text-4xl md:text-5xl font-extrabold 
                      bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#0077B5] to-[#004182] mb-16"
        >
          Choose Your Path
        </motion.h1>

        {/* Role Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          initial="initial"
          animate="animate"
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-8 shadow-md 
                         hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col items-center space-y-6">
                  <role.icon
                    className="w-16 h-16 text-[#0077B5] mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-2xl font-semibold text-[#004182] text-center">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm px-4">
                    {role.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRoleSelect(role.route)}
                  className="mt-6 w-full px-6 py-3 bg-gradient-to-r 
                             from-[#0077B5] to-[#004182] text-white 
                             rounded-lg hover:bg-gradient-to-r 
                             hover:from-[#005885] hover:to-[#003366]
                             transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5]"
                >
                  {role.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;