import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightCircle, Award, Users, ArrowRight } from "lucide-react";
import heroImage from "../../images/hero.svg";

export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[100%] py-12 px-4 lg:px-10 overflow-hidden bg-white">
      {/* Container with max-width and responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout - switches from column to row on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="order-2 lg:order-1 flex flex-col justify-center space-y-4 sm:space-y-6"
          >
            {/* Headline with responsive font sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Discover Your Dream Role with Precision
              </span>
            </h1>

            {/* Subheading with responsive sizing and improved line-height */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
              SELECTSKILLSET bridges candidates, interviewers, and employers
              through smart tools, personalized journeys, and seamless hiring
              experiences.
            </p>

            {/* CTA Button with hover effects */}
            <div className="pt-2 sm:pt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 w-max bg-white border-2 border-primary rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="text-sm sm:text-base font-semibold">
                  Get Started
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* Features with responsive spacing */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="flex items-center gap-2 text-primary"
              >
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm font-medium">Trusted</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="flex items-center gap-2 text-primary"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm font-medium">
                  Community
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="flex items-center gap-2 text-primary"
              >
                <ArrowRightCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm font-medium">
                  Progressive
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="order-1 lg:order-2 relative w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-xl mx-auto lg:mx-0 overflow-hidden ">
              <img
                src={heroImage}
                alt="Modern hiring process illustration"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
