import { motion, Variants } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  Rocket,
  Users,
  Briefcase,
  Target,
  Code,
  Globe,
  Shield,
  BarChart2,
  Clock,
  Award,
  HeartHandshake,
} from "lucide-react";
import img1 from "../../images/about.png";
import img2 from "../../images/about.svg";

// Constants
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

// Components
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
  // Updated data with aligned messaging
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Skill Development",
      description:
        "Master in-demand skills through structured learning paths and curated technical content built for modern tech careers.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Mock Interviews & Feedback",
      description:
        "Book realistic mock interviews with professionals and receive detailed feedback on technical, communication, and problem-solving skills.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Performance-Based Discovery",
      description:
        "Get noticed by recruiters based on your actual performance, not just your resume. Join our ranked talent pool.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community-Driven Learning",
      description:
        "Grow with a supportive network of peers, mentors, and hiring professionals dedicated to mutual career growth.",
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-primary" />,
      title: "Smart Career Tools",
      description:
        "Access resume builders, personalized assessments, and intelligent career path guidance to make smarter moves.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Global Opportunities",
      description:
        "Expand your professional reach by connecting with recruiters and mentors across the globe.",
    },
  ];

  const solutions = [
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "For Candidates",
      features: [
        "Technical interview simulations",
        "Career path discovery",
        "Skill-based resume optimization",
        "Get ranked and discovered by recruiters",
      ],
    },
    {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: "For Interviewers",
      features: [
        "Earn through mock interviews",
        "Build professional recognition",
        "Flexible scheduling",
        "Support the next generation of tech talent",
      ],
    },
    {
      icon: <Target className="w-10 h-10 text-primary" />,
      title: "For HR Teams",
      features: [
        "Access pre-vetted candidate pools",
        "Skill-based candidate ranking",
        "Efficient and diverse hiring pipelines",
        "Ready-to-use interview frameworks",
      ],
    },
  ];

  const missionValues = [
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Efficiency",
      description:
        "We streamline the learning-to-hiring journey through automation and expert support.",
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Meritocracy",
      description:
        "Talent and effort come first — we prioritize performance, not paper.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      title: "Community",
      description:
        "We foster mentorship and meaningful professional relationships.",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Trust & Transparency",
      description:
        "Clear ratings, real feedback, and secure systems you can rely on.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="py-24 bg-gradient-to-br from-primary to-secondary"
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
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
              About SELECTSKILLSET
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl mb-8 drop-shadow"
            >
              We’re revolutionizing tech career development by connecting
              candidates, interviewers, and employers through smart tools, real
              feedback, and performance-driven hiring.
            </motion.p>
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
              className="w-full h-full object-contain"
              loading="lazy"
              variants={itemVariants}
            />
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-extrabold text-primary"
              >
                Who We Are
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-700 text-lg"
              >
                SELECTSKILLSET was founded in 2024 with one bold mission: to
                remove guesswork from hiring and career growth. We empower
                individuals to learn, perform, and shine — while enabling
                companies to hire with confidence and clarity.
              </motion.p>
              <motion.ul
                variants={containerVariants}
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
              >
                {[
                  "Structured career path development",
                  "Industry-expert mock interviews",
                  "Performance-based recruitment",
                  "Continuous skill validation",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    variants={itemVariants}
                  >
                    <CheckCircle2 className="text-primary w-6 h-6" />
                    <span className="text-base md:text-lg">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                className="pt-8"
              >
                <h3 className="text-2xl font-semibold text-primary mb-6">
                  Our Mission & Values
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {missionValues.map((value, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {value.icon}
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          {value.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
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
              Why Professionals Choose Us
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              From first-time coders to seasoned engineers — SELECTSKILLSET is
              where growth meets opportunity.
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
              Build for Everyone
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Our platform delivers tailored value for candidates, interviewers,
              and hiring teams alike.
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
