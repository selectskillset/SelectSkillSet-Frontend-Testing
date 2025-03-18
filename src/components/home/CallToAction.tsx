import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "../../images/calltoaction.jpg";

const CallToAction: React.FC = () => {
  return (
    <section
      className="relative py-20 overflow-hidden text-white"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(45deg, rgba(0, 119, 181, 0.3), rgba(0, 75, 130, 0.3))",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg">
            Ready to elevate your professional journey?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* Primary CTA Button */}
            <Link
              to="/signup"
              className="relative px-8 py-5 rounded-lg font-semibold 
                        bg-white text-[#0077B5] shadow-lg 
                        transition-all duration-300 
                       "
            >
              Sign Up Now
            </Link>

            {/* Secondary CTA Button */}
            <Link
              to="/about"
              className="relative px-8 py-5 rounded-lg font-semibold 
                        border-2 border-white shadow-lg 
                        transition-all duration-300 
                        hover:bg-white hover:text-[#0077B5]
                        active:bg-opacity-90"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CallToAction);
