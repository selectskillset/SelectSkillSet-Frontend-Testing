import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Award, Building2, Briefcase, Globe, Star } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-World Experience",
    description:
      "Practice interviews with experts who work in the industry you aspire to join.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
  {
    icon: Award,
    title: "Personalized Feedback",
    description:
      "Receive in-depth evaluations to target specific areas of improvement.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
  {
    icon: Building2,
    title: "Enhanced Hiring Process",
    description:
      "HR teams gain access to a curated pool of skilled and pre-assessed candidates.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
  {
    icon: Briefcase,
    title: "Skill Development Focus",
    description:
      "Not just mock interviews—but a path to becoming the best version of yourself.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with professionals, candidates, and interviewers from across the globe, anytime, anywhere.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
  {
    icon: Star,
    title: "Trusted Platform",
    description:
      "Join thousands of users who trust us for transparent, efficient, and impactful hiring solutions.",
    color: "bg-blue-50",
    iconColor: "text-[#0077B5]",
  },
];

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  index: number;
}> = React.memo(
  ({ icon: Icon, title, description, color, iconColor, index }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className={`${color} p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
      >
        <div className={`${iconColor} mb-4`}>
          <Icon size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#0077B5]">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    );
  }
);

export const Features: React.FC = () => {
  const memoizedFeatures = useMemo(() => features, []);

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#0077B5]">
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Explore how our platform empowers candidates, interviewers, and
            corporates to achieve success.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memoizedFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
