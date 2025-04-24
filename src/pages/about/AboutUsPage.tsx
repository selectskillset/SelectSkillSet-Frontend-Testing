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
import img1 from "../../images/aboutImage.jpg";
import img2 from "../../images/about.svg";
import AboutUsComponent from "../../components/home/AboutUsComponent";

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
  // Data
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Skill Development",
      description:
        "Expert-curated learning paths with 500+ courses across 20+ tech domains, updated monthly to reflect industry trends",
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Career Growth",
      description:
        "Personalized roadmap with AI-driven recommendations to accelerate your path to dream tech roles",
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "Real-world Projects",
      description:
        "Hands-on experience with 100+ industry-relevant projects and code review from senior engineers",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Global Community",
      description:
        "Connect with 50,000+ tech professionals worldwide for networking and mentorship",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Interview Prep",
      description:
        "Comprehensive preparation with 1000+ interview questions and mock interviews with industry experts",
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-primary" />,
      title: "Progress Tracking",
      description:
        "Detailed analytics dashboard to monitor your skill growth and career readiness",
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


  const missionValues = [
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Efficiency",
      description: "Streamlining the learning-to-hiring process",
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Excellence",
      description: "Maintaining the highest standards in tech education",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      title: "Community",
      description: "Fostering collaboration and support networks",
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
          backgroundPosition: "bottom",
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
              Empowering Tech Careers Through Expert Guidance
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl mb-8 drop-shadow"
            >
              Join professionals mastering in-demand skills with our
              industry-proven methodologies and personalized career coaching
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
              className="w-full h-full object-cover"
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
                Founded in 2024, we've revolutionized tech career preparation by
                bridging the gap between learning and employment through:
              </motion.p>
              <motion.ul
                variants={containerVariants}
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
              >
                {[
                  "Industry-validated skill assessments designed by FAANG engineers",
                  "Real-world project simulations mirroring actual work environments",
                  "Personalized mentorship from senior tech professionals",
                  "Continuous curriculum updates based on market demands",
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
                <div className="grid md:grid-cols-3 gap-6">
                  {missionValues.map((value, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        {value.icon}
                        <h4 className="font-semibold text-secondary">
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
              Transform Your Career Journey
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive tools and resources for every stage of your
              professional development, from beginner to senior level
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
              Tailored Solutions for Tech Ecosystem
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive platforms connecting talent with opportunity through
              specialized solutions
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
