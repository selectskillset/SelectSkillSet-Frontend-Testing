import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  Globe2,
  Rocket,
  Briefcase,
  Target,
  Users,
} from "lucide-react";
import img1 from "../../images/candidate.jpg";
import img2 from "../../images/img2.jpg";

const AboutUsPage: React.FC = () => {
  // Feature Data
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-[#0a66c2]" />,
      title: "Skill Development",
      description:
        "Access curated learning paths and real-world practice scenarios tailored to your career goals.",
    },
    {
      icon: <Globe2 className="w-8 h-8 text-[#0a66c2]" />,
      title: "Global Network",
      description:
        "Connect with industry experts and peers from diverse backgrounds worldwide.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#0a66c2]" />,
      title: "Career Growth",
      description:
        "Get personalized guidance and feedback to accelerate your professional development.",
    },
  ];

  // Solutions Data
  const solutions = [
    {
      icon: <Users className="w-12 h-12 text-[#0a66c2]" />,
      title: "For Candidates",
      features: [
        "Mock interviews with industry experts",
        "Personalized feedback and coaching",
        "Technical skill assessments",
        "Career path guidance",
      ],
    },
    {
      icon: <Briefcase className="w-12 h-12 text-[#0a66c2]" />,
      title: "For Freelancers",
      features: [
        "Flexible mentoring opportunities",
        "Professional network growth",
        "Industry recognition",
        "Knowledge sharing platform",
      ],
    },
    {
      icon: <Target className="w-12 h-12 text-[#0a66c2]" />,
      title: "For HR Teams",
      features: [
        "Pre-assessed candidate pool",
        "Streamlined hiring process",
        "Quality talent matching",
        "Diversity hiring support",
      ],
    },
  ];

  return (
    <div className="mt-10 bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#f3f2ef] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
          >
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-bold text-4xl text-[#0077B5] mb-5 leading-tight">
                Empowering Tech Diversity Through Expert Collaboration
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join a community where diversity meets expertise. Prepare,
                practice, and succeed in your tech career journey.
              </p>
            </motion.div>

            {/* Right Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={img1}
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-bold text-4xl text-[#0077B5] mb-5 leading-tight">
              Transform Your Tech Career Journey
            </h2>
            <p className="text-xl text-gray-600">
              We provide comprehensive solutions for tech professionals at every
              stage of their career.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#f3f2ef]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
          >
            {/* Left Column: Image */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={img2}
                alt="Professional development"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>

            {/* Right Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-bold text-4xl text-[#0077B5] mb-5 leading-tight">
                About SELECTSKILLSET
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  At Selectskillset, we're revolutionizing how tech
                  professionals prepare for their careers. Our platform combines
                  expert guidance with real-world practice, creating an
                  environment where learning and growth happen naturally.
                </p>
                <div className="space-y-4">
                  {[
                    "Personalized learning paths tailored to your goals",
                    "Expert mentorship from industry leaders",
                    "Real-world project experience",
                    "Comprehensive interview preparation",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#0a66c2]" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="font-bold text-4xl text-[#0077B5] mb-5 leading-tight">
                Tailored Solutions for Everyone
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're a job seeker, freelancer, or HR professional, we
                have the tools and resources you need.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#f3f2ef] p-8 rounded-2xl"
                >
                  <div className="mb-6">{solution.icon}</div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                    {solution.title}
                  </h3>
                  <ul className="space-y-4">
                    {solution.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0a66c2]" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
