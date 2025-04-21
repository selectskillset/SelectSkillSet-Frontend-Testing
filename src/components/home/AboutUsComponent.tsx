import React, { useMemo } from "react";
import { motion } from "framer-motion";
import image from "../../images/Interviewers.jpeg";
import { Award, Briefcase, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AboutUsProps {
  src?: string;
  alt?: string;
  className?: string;
}

const AboutUsComponent: React.FC<AboutUsProps> = ({
  src = image,
  alt = "About Selectskillset",
  className,
}) => {
  const navigate = useNavigate();
  // Distinct border-radius keyframes for each layer
  const borderRadiusKeyframesOuter = useMemo(
    () => [
      "40% 60% 60% 40% / 40% 40% 60% 60%",
      "55% 45% 60% 40% / 40% 40% 60% 60%",
      "60% 40% 55% 45% / 45% 55% 40% 60%",
      "40% 60% 55% 45% / 40% 60% 45% 55%",
      "45% 55% 60% 40% / 40% 40% 60% 60%",
      "40% 60% 60% 40% / 40% 40% 60% 60%",
    ],
    []
  );

  const borderRadiusKeyframesMiddle = useMemo(
    () => [
      "42% 58% 58% 42% / 42% 42% 58% 58%",
      "57% 43% 58% 42% / 42% 42% 58% 58%",
      "58% 42% 57% 43% / 43% 57% 42% 58%",
      "42% 58% 57% 43% / 42% 58% 43% 57%",
      "43% 57% 58% 42% / 42% 42% 58% 58%",
      "42% 58% 58% 42% / 42% 42% 58% 58%",
    ],
    []
  );

  const borderRadiusKeyframesOverlay = useMemo(
    () => [
      "44% 56% 56% 44% / 44% 44% 56% 56%",
      "56% 44% 56% 44% / 44% 44% 56% 56%",
      "56% 44% 54% 46% / 44% 46% 44% 56%",
      "44% 56% 54% 46% / 44% 56% 46% 44%",
      "45% 55% 56% 44% / 44% 44% 56% 56%",
      "44% 56% 56% 44% / 44% 44% 56% 56%",
    ],
    []
  );

  // Animation transition settings
  const outerTransition = { duration: 8, repeat: Infinity, ease: "linear" };
  const middleTransition = {
    duration: 10,
    repeat: Infinity,
    ease: "linear",
    delay: 1,
  };
  const overlayTransition = {
    duration: 12,
    repeat: Infinity,
    ease: "linear",
    delay: 2,
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-full h-[70vmin] rounded-3xl overflow-hidden">
              {/* Outer Animated Gradient Border Layer */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesOuter[0] }}
                animate={{
                  borderRadius: borderRadiusKeyframesOuter,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={outerTransition}
                className="absolute inset-0 bg-gradient-to-br from-primary to-secondary bg-[length:200%_200%] shadow-lg"
              />

              {/* Middle Image Container */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesMiddle[0] }}
                animate={{ borderRadius: borderRadiusKeyframesMiddle }}
                transition={middleTransition}
                className="relative w-full h-full overflow-hidden rounded-3xl opacity-85"
              >
                <img
                  src={src}
                  alt={alt}
                  className={`w-full h-full object-cover ${className || ""}`}
                />
              </motion.div>

              {/* Top Overlay Layer */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesOverlay[0] }}
                animate={{ borderRadius: borderRadiusKeyframesOverlay }}
                transition={overlayTransition}
                className="absolute inset-0 pointer-events-none rounded-3xl bg-white/10 opacity-65"
              />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
              About SELECTSKILLSET
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At Selectskillset, we empower job seekers, freelancers, and HR
              professionals through practice and feedback. Our platform bridges
              the gap between candidates and companies by offering:
            </p>

            {/* Features List */}
            <ul className="space-y-4 text-lg text-gray-600 mb-8">
              <li className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>
                  Real-world mock interviews and personalized feedback for
                  candidates.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary" />
                <span>
                  Opportunities for freelancers to mentor future IT leaders.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-primary" />
                <span>
                  Access to pre-assessed, high-quality candidates for HR teams.
                </span>
              </li>
            </ul>

            {/* Mission Statement */}
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to close the skills gap and build a stronger, more
              confident IT workforce.
            </p>

            {/* Call-to-Action Button */}
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Learn More <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsComponent;
