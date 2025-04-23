import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import {
  Code,
  Monitor,
  Users,
  ClipboardList,
  FileText,
  BarChart2,
  FileCheck,
  ArrowRight,
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
      icon: <Code className="w-5 h-5" />,
      description: [
        "Technical interview simulations",
        "Personalized skill assessments",
        "Career path recommendations",
        "Professional resume optimization",
      ],
      highlight: "Candidate Tools",
      color: "primary",
    },
    {
      stage: "For Freelancers",
      icon: <Monitor className="w-5 h-5" />,
      description: [
        "Project-based learning",
        "Client communication tools",
        "Portfolio builder",
        "Freelance marketplace",
      ],
      highlight: "Freelance Support",
      color: "secondary",
    },
    {
      stage: "For HR Teams",
      icon: <Users className="w-5 h-5" />,
      description: [
        "Pre-vetted candidate pool",
        "Skill-based matching",
        "Diversity analytics",
        "Interview templates",
      ],
      highlight: "Recruitment Solutions",
      color: "tertiary",
    },
  ];

  const getIconComponent = (index) => {
    const icons = [
      <ClipboardList key={0} className="w-4 h-4 text-primary" />,
      <FileText key={1} className="w-4 h-4 text-secondary" />,
      <BarChart2 key={2} className="w-4 h-4 text-tertiary" />,
      <FileCheck key={3} className="w-4 h-4 text-primary" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Tailored Support for Every Professional
          </motion.h2>
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

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-6xl">
          {/* Vertical Line */}
          <div className="absolute left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2" />

          {/* Animated Progress Line */}
          <motion.div
            className="absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-secondary transform -translate-x-1/2 origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Milestones */}
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
                },
                secondary: {
                  bg: "bg-secondary/5",
                  text: "text-secondary",
                  border: "border-secondary/30",
                  hover: "hover:border-secondary/50",
                },
                tertiary: {
                  bg: "bg-primary/5",
                  text: "text-primary",
                  border: "border-primary/30",
                  hover: "hover:border-primary/50",
                },
              };
              const colors = colorClasses[milestone.color];

              return (
                <motion.div
                  key={milestone.stage}
                  className={`relative flex ${
                    isEven ? "justify-start" : "justify-end"
                  }`}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px 0px" }}
                  transition={{ duration: 0.5, delay }}
                >
                  <div
                    className={`w-full lg:w-[46%] p-6 lg:p-8 rounded-xl border ${colors.border} ${colors.hover} ${colors.bg} transition-all duration-300 shadow-sm hover:shadow-md`}
                  >
                    <div className="flex items-start">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mr-4 mt-0.5`}
                      >
                        <div className={colors.text}>{milestone.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium tracking-wider rounded-full ${colors.bg} ${colors.text} mb-3`}
                        >
                          {milestone.highlight}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {milestone.stage}
                        </h3>
                        <ul className="space-y-2.5">
                          {milestone.description.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start text-gray-600 text-sm lg:text-base"
                            >
                              <span className="mr-2.5 mt-0.5 flex-shrink-0">
                                {getIconComponent(i)}
                              </span>
                              <span>{item}</span>
                            </li>
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
