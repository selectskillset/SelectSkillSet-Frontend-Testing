import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Users } from "lucide-react";

const CareerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/5 via-white to-secondary-light/5 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent sm:text-5xl">
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
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-primary-light/20 hover:border-primary/30">
          <div className="bg-gradient-to-r from-primary-light/20 to-primary/20 p-3 rounded-full w-max mx-auto">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-primary-dark">
            Open Positions
          </h3>
          <p className="mt-2 text-gray-600">
            We have multiple roles open across various departments.
          </p>
          {/* <button className="mt-4 group flex items-center gap-1 text-primary hover:text-primary-dark font-medium transition-colors">
            View Openings
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button> */}
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-secondary-light/20 hover:border-secondary/30">
          <div className="bg-gradient-to-r from-secondary-light/20 to-secondary/20 p-3 rounded-full w-max mx-auto">
            <Users className="h-10 w-10 text-secondary" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-secondary-dark">
            Our Culture
          </h3>
          <p className="mt-2 text-gray-600">
            Work in an inclusive and collaborative environment.
          </p>
          {/* <button className="mt-4 group flex items-center gap-1 text-secondary hover:text-secondary-dark font-medium transition-colors">
            Learn More
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button> */}
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-primary-light/20 hover:border-secondary/30">
          <div className="bg-gradient-to-r from-primary-light/20 to-secondary/20 p-3 rounded-full w-max mx-auto">
            <ArrowRight className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-semibold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
            Grow With Us
          </h3>
          <p className="mt-2 text-gray-600">
            Develop your skills and advance your career with us.
          </p>
          {/* <button className="mt-4 group flex items-center gap-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium hover:from-primary-dark hover:to-secondary-dark transition-all">
            Explore Growth
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button> */}
        </div>
      </motion.div>

      {/* Call to Action Section */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-primary to-secondary text-white py-12 px-6 rounded-lg text-center max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold">Ready to Take the Next Step?</h2>
        <p className="mt-4 text-lg text-white/90">
          Apply now and become part of our growing team.
        </p>
        <button className="mt-6 bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-all shadow-md hover:shadow-lg">
          Apply Now
        </button>
      </motion.div> */}
    </div>
  );
};

export default CareerPage;