import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Users } from "lucide-react";

const CareerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold text-blue-700 sm:text-5xl">
          Explore Exciting Career Opportunities
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Join our team and grow with us. Opportunities are available for
          talented individuals like you!
        </p>
      </motion.div>

      {/* Career Highlights Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      >
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <Briefcase className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-blue-700">
            Open Positions
          </h3>
          <p className="mt-2 text-gray-600">
            We have multiple roles open across various departments.
          </p>
          {/* <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600 font-medium">
            View Openings <ArrowRight className="ml-2 h-4 w-4" />
          </button> */}
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <Users className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-blue-700">
            Our Culture
          </h3>
          <p className="mt-2 text-gray-600">
            Work in an inclusive and collaborative environment.
          </p>
          {/* <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600 font-medium">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </button> */}
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <ArrowRight className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="mt-4 text-xl font-semibold text-blue-700">
            Grow With Us
          </h3>
          <p className="mt-2 text-gray-600">
            Develop your skills and advance your career with us.
          </p>
          {/* <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600 font-medium">
            Explore Growth <ArrowRight className="ml-2 h-4 w-4" />
          </button> */}
        </div>
      </motion.div>

      {/* Call to Action Section */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 bg-blue-500 text-white py-12 px-6 rounded-lg text-center max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold">Ready to Take the Next Step?</h2>
        <p className="mt-4 text-lg">
          Apply now and become part of our growing team.
        </p>
        <button className="mt-6 bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg hover:bg-blue-100 transition-colors">
          Apply Now
        </button>
      </motion.div> */}
    </div>
  );
};

export default CareerPage;
