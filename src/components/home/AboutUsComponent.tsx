import React, { useMemo } from "react";
import { motion } from "framer-motion";
import image from "../../images/img2.jpg";
import { Award, Briefcase, ChevronRight, Users } from "lucide-react";

interface AboutUsProps {
  src?: string;
  alt?: string;
  className?: string;
}

const LINKEDIN_COLORS = {
  primary: "#0077B5",
  dark: "#004182",
  light: "#00A0DC",
};

const AboutUsComponent: React.FC<AboutUsProps> = ({
  src = image,
  alt = "About Selectskillset",
  className,
}) => {
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

  // Define separate animation transition settings for each layer
  const outerTransition = useMemo(
    () => ({
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    }),
    []
  );

  const middleTransition = useMemo(
    () => ({
      duration: 10,
      repeat: Infinity,
      ease: "linear",
      delay: 1,
    }),
    []
  );

  const overlayTransition = useMemo(
    () => ({
      duration: 12,
      repeat: Infinity,
      ease: "linear",
      delay: 2,
    }),
    []
  );

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
              {/* Outer Animated Gradient Border Layer (Highest opacity) */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesOuter[0] }}
                animate={{
                  borderRadius: borderRadiusKeyframesOuter,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={outerTransition}
                className="absolute inset-0 bg-[length:200%_200%]"
                style={{
                  background:
                    "linear-gradient(45deg, #0077B5 0%, #004182 100%)", // LinkedIn colors
                  boxShadow: "-5vmin 5vmin 0 rgba(255, 255, 255, 0.1)",
                  opacity: 1, // Highest opacity for outer layer
                }}
              />

              {/* Middle Image Container with Synchronized Animated Clipping (Medium opacity) */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesMiddle[0] }}
                animate={{ borderRadius: borderRadiusKeyframesMiddle }}
                transition={middleTransition}
                className="relative w-full h-full overflow-hidden rounded-3xl"
                style={{
                  opacity: 0.85, // Slightly lower opacity
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  className={`w-full h-full object-cover ${className || ""}`}
                />
              </motion.div>

              {/* Top Overlay Layer (Lowest opacity) */}
              <motion.div
                initial={{ borderRadius: borderRadiusKeyframesOverlay[0] }}
                animate={{ borderRadius: borderRadiusKeyframesOverlay }}
                transition={overlayTransition}
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.12)", // Lighter overlay color
                  opacity: 0.65, // Lowest opacity for overlay
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl font-extrabold text-[#0077B5] mb-6">
              About SELECTSKILLSET
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At Selectskillset, we empower job seekers, freelancers, and HR
              professionals through practice and feedback. Our platform bridges
              the gap between candidates and companies by offering:
            </p>

            {/* Features List */}
            <ul className="space-y-4 text-lg text-start text-gray-600 mb-8">
              <li className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-[#0077B5]" />
                <span>
                  Real-world mock interviews and personalized feedback for
                  candidates.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-[#0077B5]" />
                <span>
                  Opportunities for freelancers to mentor future IT leaders.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-[#0077B5]" />
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
              className="inline-flex items-center bg-[#0077B5] text-white py-3 px-6 rounded-lg 
                         hover:bg-[#004182] transition duration-300 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-[#0077B5]"
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