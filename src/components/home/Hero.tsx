import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, ArrowRightCircle, Award, Users } from "lucide-react";
import heroImage from "../../images/img2.jpg";

export const Hero = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Split Layout */}
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Section - Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col justify-center space-y-6"
        >
          {/* Header Tagline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Find Your Next Opportunity with Tailored Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
            Empowering job seekers, interviewers, and corporates to connect
            seamlessly with cutting-edge tools and personalized experiences.
          </p>

          {/* Action Button */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 sm:px-10 sm:py-5 w-max bg-white/80 backdrop-blur-lg border-2 border-primary rounded-lg shadow-md hover:bg-primary-light hover:border-primary-dark hover:text-white transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary-dark"
          >
            Get Started <LogIn className="w-5 h-5" />
          </Link>

          {/* Decorative Icons */}
          <div className="flex items-center gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2 text-primary"
            >
              <Award className="w-6 h-6" />
              <span className="text-sm sm:text-base font-medium">Trusted</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="flex items-center gap-2 text-primary"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm sm:text-base font-medium">
                Community
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="flex items-center gap-2 text-primary"
            >
              <ArrowRightCircle className="w-6 h-6" />
              <span className="text-sm sm:text-base font-medium">
                Progressive
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section - Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-2xl group"
        >
          {/* Image */}
          <img
            src={heroImage}
            alt="Business Image"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Decorative Elements */}
          <div className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-lg rounded-full shadow-lg">
            <svg
              className="w-8 h-8 text-primary animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
