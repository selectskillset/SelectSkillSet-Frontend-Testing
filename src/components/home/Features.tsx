import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Award, Building2, Briefcase, Globe, Star } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-World Experience",
    description:
      "Engage in practice interviews with industry experts tailored to your field.",
    stats: "150+ industries covered",
  },
  {
    icon: Award,
    title: "Personalized Feedback",
    description:
      "Receive detailed feedback to help you grow and improve effectively.",
    stats: "98% user satisfaction",
  },
  {
    icon: Building2,
    title: "Enhanced Hiring Process",
    description:
      "Streamline hiring with access to pre-vetted candidates and skill assessments.",
    stats: "40% faster hiring",
  },
  {
    icon: Briefcase,
    title: "Skill Development",
    description:
      "Explore structured learning paths for both technical and soft skills.",
    stats: "300+ skill modules",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Connect with professionals worldwide to expand your opportunities.",
    stats: "500k+ global users",
  },
  {
    icon: Star,
    title: "Trusted Platform",
    description:
      "Secure and reliable solutions designed for enterprise needs.",
    stats: "99.9% uptime guarantee",
  },
];

const FeatureCard = React.memo(
  ({
    icon: Icon,
    title,
    description,
    stats,
    index,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    stats: string;
    index: number;
  }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.2,
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          ease: "easeOut",
        }}
        className="bg-white/80 backdrop-blur-lg p-6 rounded-lg shadow-md border border-gray-200
                   transition-all duration-300 hover:scale-[1.02]
                   hover:shadow-lg hover:border-primary"
      >
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <Icon
              size={40}
              className="text-primary drop-shadow-sm"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-secondary mb-3">
              {title}
            </h3>
            <p className="text-gray-600 mb-4">{description}</p>
            {/* <div className="flex items-center text-sm font-medium">
              <Star size={16} className="text-yellow-500 mr-2" />
              <span className="text-primary">{stats}</span>
            </div> */}
          </div>
        </div>
      </motion.div>
    );
  }
);

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold 
                        bg-clip-text text-transparent
                        bg-gradient-to-r from-primary to-secondary mb-6"
          >
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering professionals, interviewers, and enterprises with
            cutting-edge solutions for talent development and acquisition.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                        gap-8 md:gap-12"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Features);