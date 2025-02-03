import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { value: 5000, label: "Candidates Empowered" },
  { value: 1000, label: "Interviews Conducted" },
  { value: 500, label: "Corporate Clients" },
  { value: 150, label: "Global Partners" },
  { value: 50, label: "Industry Awards" },
];

const Counter = ({ value, label, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="p-6 rounded-lg shadow-md bg-gradient-to-br from-[#0077B5] to-[#005885] transform hover:scale-105 transition-all duration-300"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 2 }}
          className="text-5xl lg:text-6xl font-extrabold text-white mb-4"
        >
          {inView ? `${value}+` : "0+"}
        </motion.div>
        <div className="text-lg font-medium text-gray-200">{label}</div>
      </div>
    </motion.div>
  );
};

export const Statistics = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#F3F2EF] to-[#E5E5E5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600">
            Transforming industries with meaningful results.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <Counter key={index} {...stat} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
};
