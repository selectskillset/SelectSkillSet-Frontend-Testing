import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  ArrowRight,
  Briefcase,
  ClipboardCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunitySpotlight = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const features = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Book a Mock Interview",
      description:
        "Choose a job role and get interviewed by an experienced professional",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Receive Detailed Feedback",
      description:
        "Get ratings across communication, problem-solving, and technical skills",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Get Discovered by Recruiters",
      description: "Your profile is listed in our top-rated talent pool",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Access Top Candidates",
      description:
        "Recruiters can browse pre-vetted, performance-rated professionals",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              Rated by Experts. Hired by Recruiters.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              SelectSkillSet connects job-ready candidates with recruiters
              through mock interviews and performance ratings.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-primary/10 rounded-xl p-6 border border-gray-200 hover:border-secondary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Triple CTA */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {/* Candidate Card */}
            <div className="text-center bg-primary/10 p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                For Candidates
              </h3>
              <p className="text-gray-600 mb-6">
                Tired of sending resumes into the void? Let your performance
                speak for itself.
              </p>
              <button
                onClick={() => navigate("/candidate-signup")}
                className="inline-flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Interviewer Card */}
            <div className="text-center bg-secondary/10 p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                For Interviewers
              </h3>
              <p className="text-gray-600 mb-6">
                Join our expert network and help shape the next generation of
                tech talent.
              </p>
              <button
                onClick={() => navigate("/interviewer-signup")}
                className="inline-flex items-center px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-all duration-300 font-medium"
              >
                Become an Interviewer
                <Users className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Recruiter Card */}
            <div className="text-center bg-primary/10 p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                For Recruiters
              </h3>
              <p className="text-gray-600 mb-6">
                Skip the clutter and access a ranked pool of pre-vetted
                candidates ready to interview.
              </p>
              <button
                onClick={() => navigate("/corporate-signup")}
                className="inline-flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium"
              >
                Browse Candidate Pool
                <Briefcase className="ml-2 w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySpotlight;
