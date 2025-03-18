import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "../../images/newBG.jpg";

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

export const Hero = () => {
  useEffect(() => {
    preloadImage(heroBg).catch((error) => {
      console.error("Failed to load background image:", error);
    });
  }, []);

  const backgroundImage = useMemo(() => {
    return `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url(${heroBg})`;
  }, [heroBg]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0A66C2",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>

      <div className="container relative z-10 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Find Your Next Opportunity with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B5] to-[#00A8E8]">
              Tailored Solutions
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 font-medium mb-10 px-4 sm:px-0"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            Empowering job seekers, interviewers, and corporates to connect
            seamlessly with cutting-edge tools and personalized experiences.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/login"
              className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white
               rounded-lg  font-semibold text-lg sm:text-lg shadow-lg 
              hover:shadow-xl transition-all duration-300 transform 
               focus:outline-none focus:ring-2 focus:ring-[#005885]"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-lg 
              text-white rounded-lg  font-semibold text-lg sm:text-lg shadow-md 
              hover:bg-white/20 transition-all duration-300 transform 
              focus:outline-none focus:ring-2 focus:ring-[#005885]"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
