import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Code, Monitor, Users, Award, ArrowRight } from "lucide-react";

const CareerJourney = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const milestones = [
    {
      stage: "Skill Mastery",
      icon: <Code className="w-6 h-6" />,
      description: "Industry-validated assessments and technical simulations",
      highlight: "For Candidates",
    },
    {
      stage: "Real-World Practice",
      icon: <Monitor className="w-6 h-6" />,
      description: "Project-based learning with client communication tools",
      highlight: "For Freelancers",
    },
    {
      stage: "Career Acceleration",
      icon: <Users className="w-6 h-6" />,
      description: "Pre-vetted candidate matching and interview preparation",
      highlight: "For HR Teams",
    },
    {
      stage: "Leadership",
      icon: <Award className="w-6 h-6" />,
      description: "Mentorship opportunities and professional growth",
      highlight: "For Professionals",
    },
  ];

  return (
    <section className="py-24 lg:py-32 " ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <motion.span
            className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary mb-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Career Progression Path
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary  mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Structured Professional Development
          </motion.h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* Vertical Line */}
          <div className="absolute left-1/2 w-0.5 h-full bg-gray-200/80 transform -translate-x-1/2 rounded-full" />

          {/* Animated Progress Line */}
          <motion.div
            className="absolute left-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-secondary transform -translate-x-1/2 origin-top rounded-full shadow-lg"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Milestones */}
          {milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;
            const delay = index * 0.15;

            return (
              <motion.div
                key={milestone.stage}
                className={`relative flex ${
                  isEven ? "justify-start" : "justify-end"
                } my-8 sm:my-12`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px 0px" }}
                transition={{ duration: 0.6, delay }}
              >
                <div
                  className={`w-full sm:w-[45%] p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                    isEven
                      ? "border-primary sm:mr-8"
                      : "border-secondary sm:ml-8"
                  }`}
                >
                  {/* Icon Container */}
                  <div
                    className={`absolute top-6 -translate-y-1/2 ${
                      isEven ? "sm:-right-10" : "sm:-left-10"
                    } hidden sm:block`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center shadow-md hover:border-primary transition-colors">
                      <div className="text-primary">{milestone.icon}</div>
                    </div>
                  </div>

                  {/* Mobile Icon */}
                  <div className="sm:hidden mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {milestone.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
                    {milestone.highlight}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.stage}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CareerJourney;
