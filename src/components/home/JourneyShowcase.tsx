import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import {
  Code,
  MonitorSmartphone,
  ClipboardList,
  FileText,
  Handshake,
  Landmark,
  UserCog,
  Briefcase,
  Target,
  Award,
  ShieldCheck,
  PieChart,
  GitPullRequest,
  MessageSquareText,
  CalendarCheck,
} from "lucide-react";

const CareerJourney = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const milestones = [
    {
      stage: "For Candidates",
      icon: <UserCog className="w-5 h-5" />,
      description: [
        "Technical interview simulations",
        "Personalized skill assessments",
        "Career path recommendations",
        "Professional resume optimization",
      ],
      highlight: "Candidate Tools",
      color: "primary",
      icons: [
        <Code key="code" className="w-4 h-4 text-primary" />,
        <ClipboardList key="clipboard" className="w-4 h-4 text-primary" />,
        <Target key="target" className="w-4 h-4 text-primary" />,
        <FileText key="file" className="w-4 h-4 text-primary" />,
      ],
    },
    {
      stage: "For Interviewers",
      icon: <MonitorSmartphone className="w-5 h-5" />,
      description: [
        "Mentorship opportunities",
        "Per-interview earnings",
        "Community building & recognition",
        "Flexible scheduling",
      ],
      highlight: "Interviewer Support",
      color: "secondary",
      icons: [
        <Handshake key="handshake" className="w-4 h-4 text-secondary" />,
        <Landmark key="landmark" className="w-4 h-4 text-secondary" />,
        <Award key="award" className="w-4 h-4 text-secondary" />,
        <CalendarCheck key="calendar" className="w-4 h-4 text-secondary" />,
      ],
    },
    {
      stage: "For HR Teams",
      icon: <Briefcase className="w-5 h-5" />,
      description: [
        "Pre-vetted candidate pool",
        "Skill-based matching",
        "Diversity analytics",
        "Interview templates",
      ],
      highlight: "Recruitment Solutions",
      color: "primary",
      icons: [
        <ShieldCheck key="shield" className="w-4 h-4 text-primary" />,
        <PieChart key="pie" className="w-4 h-4 text-primary" />,
        <GitPullRequest key="git" className="w-4 h-4 text-primary" />,
        <MessageSquareText key="message" className="w-4 h-4 text-primary" />,
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-primary/10 text-primary mb-4 uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            Our Comprehensive Solutions
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="text-4xl md:text-5xl font-extrabold 
                                 bg-clip-text text-transparent
                                 bg-gradient-to-r from-primary to-secondary mb-6"
            >
              Tailored Support for Every Professional
            </h2>
          </motion.div>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Specialized tools designed for every stage of career growth and
            recruitment
          </motion.p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Timeline line */}
          <div className="absolute left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2 hidden lg:block" />
          <motion.div
            className="absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-secondary transform -translate-x-1/2 origin-top hidden lg:block"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="space-y-8 lg:space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const delay = index * 0.15;
              const colorClasses = {
                primary: {
                  bg: "bg-primary/5",
                  text: "text-primary",
                  border: "border-primary/30",
                  hover: "hover:border-primary/50",
                  iconBg: "bg-primary/10",
                },
                secondary: {
                  bg: "bg-secondary/5",
                  text: "text-secondary",
                  border: "border-secondary/30",
                  hover: "hover:border-secondary/50",
                  iconBg: "bg-secondary/10",
                },
              };
              const colors = colorClasses[milestone.color];

              return (
                <motion.div
                  key={milestone.stage}
                  className="relative flex"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px 0px" }}
                  transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.16, 1, 0.3, 1], // Smooth easing curve
                  }}
                >
                  {/* Mobile indicator - only shows on small screens */}
                  <div className="lg:hidden absolute left-0 top-6 w-3 h-3 rounded-full bg-primary border-4 border-white z-10"></div>

                  <div
                    className={`w-full lg:w-[46%] p-6 lg:p-8 rounded-xl border ${
                      colors.border
                    } ${colors.hover} ${
                      colors.bg
                    } transition-all duration-300 shadow-sm hover:shadow-md ${
                      isEven ? "lg:mr-auto" : "lg:ml-auto"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center mr-4 mt-0.5`}
                      >
                        <div className={colors.text}>{milestone.icon}</div>
                      </div>

                      <div className="flex-1">
                        <motion.span
                          className={`inline-block px-2.5 py-1 text-xs font-medium tracking-wider rounded-full ${colors.bg} ${colors.text} mb-3`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: delay + 0.1 }}
                        >
                          {milestone.highlight}
                        </motion.span>
                        <motion.h3
                          className="text-xl font-semibold text-gray-900 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: delay + 0.2 }}
                        >
                          {milestone.stage}
                        </motion.h3>
                        <ul className="space-y-3">
                          {milestone.description.map((item, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start text-gray-600 text-sm lg:text-base"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: delay + 0.3 + i * 0.05,
                              }}
                            >
                              <span className="mr-2.5 mt-0.5 flex-shrink-0">
                                {milestone.icons[i]}
                              </span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerJourney;
