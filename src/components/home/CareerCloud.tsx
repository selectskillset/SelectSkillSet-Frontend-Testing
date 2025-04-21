import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { techCareers } from "../common/techCareers";

const MARQUEE_LINES = 6; // Reduced lines to prevent lag
const BASE_DURATION = 40; // Faster base speed for smoother animation
const LINE_HEIGHT = 80;

const CareerCloud: React.FC = () => {
  const marqueeItems = useMemo(
    () =>
      Array.from({ length: MARQUEE_LINES }, (_, i) => ({
        speed: BASE_DURATION + i * 5, // Adjusted speed variation
        direction: i % 2 === 0 ? 1 : -1,
        offset: i * LINE_HEIGHT,
      })),
    []
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto text-center">
        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Empowering Tech Careers Through Expert Guidance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join professionals mastering in-demand skills with industry-proven
            methodologies.
          </p>
        </motion.div>

        {/* Subheading */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Tailored Solutions for the Tech Ecosystem
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting talent with opportunity through specialized platforms.
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative h-[40vh] overflow-hidden">
          {marqueeItems.map((line, idx) => (
            <MarqueeLine
              key={idx}
              speed={line.speed}
              direction={line.direction}
              offset={line.offset}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Marquee Line Component
const MarqueeLine: React.FC<{
  speed: number;
  direction: number;
  offset: number;
}> = ({ speed, direction, offset }) => {
  return (
    <motion.div
      className="absolute w-full flex"
      style={{
        top: `${offset}px`,
      }}
      animate={{
        x: direction === 1 ? ["0%", "-100%"] : ["-100%", "0%"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="flex flex-nowrap gap-6 w-max">
        {[...techCareers, ...techCareers].map((career, index) => (
          <motion.div
            key={`${career.name}-${index}`}
            className="flex-shrink-0 p-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className="px-4 py-2 rounded-full flex items-center gap-2 
                         shadow-md backdrop-blur-sm hover:backdrop-blur-md 
                         transition-all border border-gray-200 hover:border-primary"
            >
              {career.icon && (
                <career.icon size={20} className="text-primary" />
              )}
              <span className="text-sm font-medium text-primary">
                {career.name}
              </span>
              <span className="text-xs text-gray-500">{career.category}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CareerCloud;
