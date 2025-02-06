import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "../../images/newBG.jpg"

// Preload the image to ensure it's cached before rendering
const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

export const Hero = () => {

  // Preload the image on component mount
  useEffect(() => {
    preloadImage(heroBg).catch((error) => {
      console.error("Failed to load background image:", error);
    });
  }, []);

  // Memoize the background image URL
  const backgroundImage = useMemo(() => {
    return `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${heroBg})`;
  }, [heroBg]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage,
        backgroundSize: "cover",
        backgroundColor: "#0A66C2", // Fallback background color
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center backdrop-blur-sm"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-6"
          >
            Find Your Next Opportunity with{" "}
            <span className="text-[#0077B5]">Tailored Solutions</span>
          </motion.h1>
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-gray-300 mb-8"
          >
            Empowering job seekers, interviewers, and corporates to connect
            seamlessly.
          </motion.p>
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/login"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-[#0077B5] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005885] shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
