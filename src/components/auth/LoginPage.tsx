import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { UserCircle, Award, Building2, ChevronRight } from "lucide-react";

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
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
  hover: {
    y: -10,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: { type: "spring", stiffness: 300 },
  },
};

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen  flex items-center py-12">
      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold 
                      bg-clip-text text-transparent 
                      bg-gradient-to-r from-primary to-primary-dark mb-4"
          >
            Choose Your Path
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join our platform and take the next step in your professional
            journey
          </motion.p>
        </motion.div>

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
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl p-8 shadow-lg 
                         transition-all duration-300 border border-gray-100
                         hover:border-primaryLight overflow-hidden relative"
            >
              {/* Decorative element */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              />

              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col items-center space-y-6">
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className="p-4 rounded-full bg-primaryLight/10"
                  >
                    <role.icon
                      className="w-12 h-12 text-primary"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 text-center">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-center px-4">
                    {role.description}
                  </p>
                </div>

                <motion.button
                  onClick={() => handleRoleSelect(role.route)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full px-6 py-3 bg-gradient-to-r 
                             from-primary to-secondary text-white 
                             rounded-lg hover:from-primaryDark hover:to-secondaryDark
                             transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryLight
                             flex items-center justify-center gap-2"
                >
                  {role.cta}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
