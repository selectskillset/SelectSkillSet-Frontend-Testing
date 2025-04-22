import { motion } from "framer-motion";
import { Users, MessageSquare, Globe, Award, ArrowRight } from "lucide-react";
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

  const communityFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Industry Circles",
      description: "Join focused groups in your professional field",
      stat: "200+ active groups",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Peer Mentoring",
      description: "Give and receive guidance from fellow professionals",
      stat: "5,000+ monthly exchanges",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Connect with professionals across countries",
      stat: "80% career growth reported",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Recognition",
      description: "Earn badges for contributions and achievements",
      stat: "10,000+ badges awarded",
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
              Professional Network
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              Your Career Community Awaits
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Connect, collaborate and grow with like-minded professionals
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                {/* <p className="text-sm font-medium text-primary">
                  {feature.stat}
                </p> */}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium group"
            >
              Join the Community
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySpotlight;
