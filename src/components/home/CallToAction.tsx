import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";

const CallToAction: React.FC = () => {
  // Floating animation for decorative elements
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Animated heading with floating words */}
          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="inline-block">
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                initial={{ y: 50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Ready to elevate
              </motion.span>
            </span>{" "}
            <span className="inline-block">
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary"
                initial={{ y: 50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                your professional
              </motion.span>
            </span>{" "}
            <span className="inline-block ">
              <motion.span
                className="inline-block"
                initial={{ y: 50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                journey?
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of professionals accelerating their careers with our
            platform.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                to="/login"
                className="relative px-8 py-4 rounded-xl font-semibold 
                          bg-gradient-to-r from-primary to-secondary 
                          text-white shadow-lg hover:shadow-xl
                          transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link
                to="/about"
                className="relative px-8 py-4 rounded-xl font-semibold 
                          border-2 border-gray-800 bg-white/80 backdrop-blur-sm
                          text-gray-800 shadow-lg hover:shadow-xl hover:bg-white
                          transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CallToAction);
