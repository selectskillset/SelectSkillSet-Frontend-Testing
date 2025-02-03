import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hrProfetional from "../../images/hrProfetional.jpg";
import candidate from "../../images/candidate.jpg";
import Interviewers from "../../images/Interviewers.jpeg";

const features = [
  {
    title: "How It Works for HR Professionals",
    image: hrProfetional,
    points: [
      {
        title: "Search & Discover Talent",
        description:
          "Browse through a pool of highly-rated candidates, filtered by skills, experience, and interview ratings.",
      },
      {
        title: "Find the Perfect Fit",
        description:
          "Use detailed performance metrics to identify top talent who meet your job requirements.",
      },
      {
        title: "Streamline Hiring",
        description:
          "Save time and effort by connecting directly with candidates pre-assessed by industry experts.",
      },
    ],
    buttonText: "Get Started",
    link: "/hr-signup",
  },
  {
    title: "How It Works for Candidates",
    image: candidate,
    points: [
      {
        title: "Select Your Skills",
        description:
          "Choose from a variety of IT domains and technologies, such as software development, data science, cloud computing, cybersecurity, and more.",
      },
      {
        title: "Schedule a Mock Interview",
        description:
          "Match with a freelance interviewer who specializes in your desired skill set and schedule your mock interview at a convenient time.",
      },
      {
        title: "Receive Feedback & Ratings",
        description:
          "Get a detailed performance report with strengths, areas for improvement, and actionable suggestions to boost your readiness.",
      },
    ],
    buttonText: "Get Started",
    link: "/candidate-signup",
  },
  {
    title: "How It Works for Freelance Interviewers",
    image: Interviewers,
    points: [
      {
        title: "Share Your Expertise",
        description:
          "Join our platform as an interviewer and leverage your industry experience to guide aspiring candidates.",
      },
      {
        title: "Conduct Mock Interviews",
        description:
          "Engage with candidates in real-world interview scenarios tailored to their technical expertise.",
      },
      {
        title: "Provide Insightful Feedback",
        description:
          "Deliver thorough assessments, rate candidates on their skillset, and help shape the next generation of IT professionals.",
      },
    ],
    buttonText: "Join as Interviewer",
    link: "/interviewer-signup",
  },
];

export const LandingFeature = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-r from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col"
            >
              {/* Image Section */}
              <div
                className="w-full h-56 sm:h-64 lg:h-72 bg-cover bg-center transition-all duration-300 ease-in-out transform "
                style={{ backgroundImage: `url(${feature.image})` }}
              ></div>

              {/* Content Section */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0077B5] text-center mb-3">
                  {feature.title}
                </h2>

                {/* Points List */}
                <ul className="text-sm sm:text-base text-gray-700 space-y-3 text-left mb-3">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-semibold">{point.title}:</span>{" "}
                      {point.description}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <div className="text-center mt-auto">
                  <Link
                    to={feature.link}
                    className="block w-full sm:w-auto px-6 py-3 bg-[#0077B5] text-white text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-[#005582] transform "
                  >
                    {feature.buttonText}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
