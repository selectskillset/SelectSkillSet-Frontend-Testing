import React from "react";
import { motion, Variants } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  Rocket,
  Users,
  Briefcase,
  Target,
} from "lucide-react";
import img1 from "../../images/calltoaction.jpg";
import img2 from "../../images/img2.jpg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      ease: "easeInOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const FeatureCard = ({ feature }: { feature: any }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.03 }}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
  >
    <div className="mb-4">{feature.icon}</div>
    <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
    <p className="text-gray-600">{feature.description}</p>
  </motion.div>
);

const SolutionCard = ({ solution }: { solution: any }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-[#F8FAFC] p-6 rounded-lg transition-all hover:bg-[#EBF4FF]"
  >
    <div className="mb-4">{solution.icon}</div>
    <h3 className="text-2xl font-semibold text-secondary mb-6">
      {solution.title}
    </h3>
    <ul className="space-y-4">
      {solution.features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center space-x-3">
          <CheckCircle2 className="text-primary w-5 h-5" />
          <span className="text-gray-700 text-base">{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const AboutUsPage = () => {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Skill Development",
      description:
        "Expert-curated learning paths tailored to your career goals",
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Career Growth",
      description: "Personalized roadmap to your dream tech role",
    },
  ];

  const solutions = [
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "For Candidates",
      features: [
        "Technical interview simulations",
        "Personalized skill assessments",
        "Career path recommendations",
        "Professional resume optimization",
      ],
    },
    {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: "For Freelancers",
      features: [
        "Project-based learning",
        "Client communication tools",
        "Portfolio builder",
        "Freelance marketplace",
      ],
    },
    {
      icon: <Target className="w-10 h-10 text-primary" />,
      title: "For HR Teams",
      features: [
        "Pre-vetted candidate pool",
        "Skill-based matching",
        "Diversity analytics",
        "Interview templates",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="py-20 bg-gradient-to-br from-primary to-secondary"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6 lg:px-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl text-white"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
            >
              Empowering Tech Careers Through Expert Guidance
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl mb-8 drop-shadow"
            >
              Join professionals mastering in-demand skills with industry-proven
              methodologies
            </motion.p>
            {/* <div className="flex space-x-4">
              <a
                href="#"
                className="px-6 py-3 bg-white text-primary rounded-lg
                          hover:bg-secondary hover:text-white transition-all
                          flex items-center space-x-2"
              >
                <Linkedin className="w-5 h-5" />
                <span>Join LinkedIn Community</span>
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-white/20 text-white rounded-lg
                          hover:bg-white/30 transition-all
                          flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Us</span>
              </a>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
            >
              Transform Your Career Journey
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive tools for every stage of your professional
              development
            </motion.p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 lg:px-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.img
              src={img2}
              alt="Professional development"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              loading="lazy"
              variants={itemVariants}
            />
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-extrabold text-primary"
              >
                About SELECTSKILLSET
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-700 text-lg"
              >
                Revolutionizing tech career preparation with:
              </motion.p>
              <motion.ul
                variants={containerVariants}
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
              >
                {[...Array(4)].map((_, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    variants={itemVariants}
                  >
                    <CheckCircle2 className="text-primary w-6 h-6" />
                    <span className="text-base md:text-lg">
                      {index % 2 === 0
                        ? "Industry-validated skill assessments"
                        : "Real-world project simulations"}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
            >
              Tailored Solutions for Tech Ecosystem
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Connecting talent with opportunity through specialized platforms
            </motion.p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;