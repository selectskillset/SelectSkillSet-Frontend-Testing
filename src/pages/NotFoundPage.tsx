import { motion } from "framer-motion";
import { ArrowRight, Home, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import notFoundImg from "../images/notfound.svg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.5,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 25px -5px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
      scale: 0.97,
    },
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.85, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.4,
      },
    },
    hover: {
      rotate: 1,
      transition: { duration: 0.5, type: "spring" },
    },
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 ">
      <motion.div
        className="max-w-6xl w-full  overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Content */}
          <div className="p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary mb-5 shadow-sm">
                404 Not Found
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 mb-5 leading-tight"
              variants={itemVariants}
            >
              <span className="text-primary">Page Not Found</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed"
              variants={itemVariants}
            >
              The page you're looking for has either been moved, deleted, or
              never existed. Let's get you back on track.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Home className="w-5 h-5" />
                Return Home
              </motion.button>
              <motion.button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-sm flex items-center justify-center gap-2 text-lg font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ArrowRight className="w-5 h-5" />
                Go Back
              </motion.button>
            </motion.div>

            <motion.div
              className="space-y-4 border-t border-gray-100 pt-8"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Need immediate help?
              </h3>
              <div className="flex items-center gap-3 text-gray-600 group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <a
                  href="mailto:selectskillset@gmail.com"
                  className="hover:underline hover:text-primary"
                >
                  selectskillset@gmail.com
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:flex items-center justify-center p-8 ">
            <motion.div
              className="w-full h-full max-w-md"
              variants={illustrationVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={notFoundImg}
                alt="404 illustration"
                className="w-full h-full object-contain drop-shadow-lg"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
