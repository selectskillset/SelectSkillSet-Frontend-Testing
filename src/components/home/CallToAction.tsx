import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const CallToAction: React.FC = () => {
  const backgroundSvg = useMemo(
    () =>
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0077B5" fill-opacity="0.1" d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,192C672,203,768,181,864,160C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>`
      ),
    []
  );

  return (
    <section className="py-20 bg-gradient-to-r from-[#0077B5] to-[#005885] relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-[url('data:image/svg+xml,${backgroundSvg}')] opacity-10`}
          style={{ backgroundSize: "cover" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to take the next step in your journey?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-[#0077B5] rounded-lg font-semibold
                       transform transition-all duration-200 hover:scale-105
                       shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold
                       transform transition-all duration-200 hover:scale-105 hover:bg-white
                       hover:text-[#0077B5] shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
