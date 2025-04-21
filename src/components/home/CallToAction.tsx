import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import heroBg from "../../images/tech.jpg";

const CallToAction: React.FC = () => {
  return (
    <section
      className="relative py-20 overflow-hidden text-white"
      // style={{
      //   backgroundImage: `url(${heroBg})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(45deg, rgba(67, 56, 202, 0.3), rgba(124, 58, 235, 0.3))",
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
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-lg 
                       bg-clip-text text-transparent bg-gradient-to-r 
                       from-primary to-secondary"
          >
            Ready to elevate your professional journey?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* Primary CTA Button */}
            {/* <Link
              to="/signup"
              className="relative px-8 py-5 rounded-lg font-semibold 
                        bg-gradient-to-r from-primary to-secondary 
                        text-white shadow-lg hover:scale-[1.03] 
                        transition-all duration-300 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Sign Up Now
            </Link> */}

            {/* Secondary CTA Button */}
            <Link
              to="/about"
              className="relative px-8 py-5 rounded-lg font-semibold 
                        border-2 border-white bg-primary-dark backdrop-blur-lg 
                        text-white shadow-lg hover:bg-white hover:text-primary 
                        transition-all duration-300 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
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
