import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "../../images/newBG.jpg";

export const Hero = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${heroBg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Find Your Next Opportunity with{" "}
            <span className="text-[#0077B5] animate__animated animate__fadeIn animate__delay-1s">
              Tailored Solutions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12"
          >
            Empowering job seekers, interviewers, and corporates to connect
            seamlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-[#0077B5] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005885] shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/request-demo"
              className="px-8 py-4 border-2 border-[#0077B5] text-[#0077B5] rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#0077B5] hover:text-white shadow-lg hover:shadow-xl"
            >
              Request Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
