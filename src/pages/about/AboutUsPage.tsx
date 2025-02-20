import React, { memo } from "react";
import { motion, Variants } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  Globe2,
  Rocket,
  Briefcase,
  Target,
  Users,
} from "lucide-react";

// Direct image imports
import img1 from "../../images/candidate.jpg";
import img2 from "../../images/img2.jpg";

// Interfaces
interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Solution {
  icon: JSX.Element;
  title: string;
  features: string[];
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// Feature Component
const FeatureCard = memo(({ feature }: { feature: Feature }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
  >
    <div className="mb-4">{feature.icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
    <p className="text-gray-600 text-sm">{feature.description}</p>
  </motion.div>
));

// Solution Component
const SolutionCard = memo(({ solution }: { solution: Solution }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-[#f3f2ef] p-6 rounded-xl transition-all hover:bg-[#ebe9e6]"
  >
    <div className="mb-4">{solution.icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{solution.title}</h3>
    <ul className="space-y-3">
      {solution.features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#0a66c2] flex-shrink-0" />
          <span className="text-gray-700 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
));

const AboutUsPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <GraduationCap className="w-7 h-7 text-[#0a66c2]" />,
      title: "Skill Development",
      description: "Curated learning paths and real-world practice scenarios.",
    },
    {
      icon: <Globe2 className="w-7 h-7 text-[#0a66c2]" />,
      title: "Global Network",
      description: "Connect with experts and peers worldwide.",
    },
    {
      icon: <Rocket className="w-7 h-7 text-[#0a66c2]" />,
      title: "Career Growth",
      description: "Personalized guidance for professional development.",
    },
  ];

  const solutions: Solution[] = [
    {
      icon: <Users className="w-10 h-10 text-[#0a66c2]" />,
      title: "For Candidates",
      features: [
        "Mock interviews with experts",
        "Personalized feedback",
        "Skill assessments",
        "Career guidance",
      ],
    },
    {
      icon: <Briefcase className="w-10 h-10 text-[#0a66c2]" />,
      title: "For Freelancers",
      features: [
        "Flexible mentoring",
        "Network growth",
        "Industry recognition",
        "Knowledge sharing",
      ],
    },
    {
      icon: <Target className="w-10 h-10 text-[#0a66c2]" />,
      title: "For HR Teams",
      features: [
        "Pre-assessed candidates",
        "Streamlined hiring",
        "Quality matching",
        "Diversity support",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen antialiased">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#f3f2ef] to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0077b5] leading-tight">
                Empowering Tech Diversity
              </h1>
              <p className="text-lg text-gray-600">
                Join a community where diversity meets expertise to succeed in your tech career.
              </p>
            </div>
            <img
              src={img1}
              alt="Team collaboration"
              loading="lazy"
              decoding="async"
              className="rounded-xl shadow-xl w-full h-auto object-cover transition-opacity hover:opacity-95"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077b5] mb-4">
              Transform Your Career
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for tech professionals at every stage.
            </p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#f3f2ef]">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <img
              src={img2}
              alt="Professional development"
              loading="lazy"
              decoding="async"
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0077b5] leading-tight">
                About SELECTSKILLSET
              </h2>
              <p className="text-gray-700 text-base">
                Revolutionizing tech career preparation with expert guidance and real-world practice.
              </p>
              <div className="space-y-4">
                {[
                  "Personalized learning paths",
                  "Expert mentorship",
                  "Real-world projects",
                  "Interview preparation",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#0a66c2]" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0077b5] mb-4">
                Tailored Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tools and resources for job seekers, freelancers, and HR professionals.
              </p>
            </div>
            <motion.div className="grid md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <SolutionCard key={index} solution={solution} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default memo(AboutUsPage);