import React from "react";
import { motion } from "framer-motion";
import aboutimg from "../../images/aboutImg.jpg";

// Data for About Us sections
const aboutUsData = [
  {
    imageSrc: aboutimg,
    alt: "Diversity and teamwork in tech",
    title: "About SELECTSKILLSET",
    description: [
      "At Selectskillset, we believe that practice and feedback are the cornerstones of success in the competitive world of IT. Founded by a team of industry professionals and hiring specialists, our platform was created to empower job seekers, freelancers, and HR professionals alike.",
      "We understand the challenges candidates face when preparing for interviews in today’s fast-paced IT industry. Likewise, we know companies strive to hire skilled professionals who can make an immediate impact. SELECTSKILLSET addresses both needs by offering a platform where:",
    ],
    points: [
      "Candidates can fine-tune their skills through real-world mock interviews and insightful feedback.",
      "Freelancers can share their expertise while helping shape the careers of future IT leaders.",
      "HR Teams can access a pool of pre-assessed, high-quality candidates, saving time and effort in the hiring process.",
    ],
    conclusion:
      "Our mission is simple: to close the skills gap and build a stronger, more confident IT workforce. With a focus on real-world scenarios, personalized feedback, and measurable growth, we’re here to ensure that every candidate gets the best chance to succeed.",
  },
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-secondary py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {aboutUsData.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-xl rounded-xl p-8 mb-12 border border-gray-300 transform hover:scale-105 transition duration-300"
          >
            {/* Image Section */}
            <div className="mb-8">
              <img
                src={section.imageSrc}
                alt={section.alt}
                className="w-full h-80 object-cover rounded-xl shadow-lg hover:opacity-90 transition duration-300"
              />
            </div>

            {/* Title Section */}
            <h2 className="text-4xl font-semibold text-center text-linkedin mb-6">
              {section.title}
            </h2>

            {/* Description Section */}
            {section.description.map((text, idx) => (
              <p
                key={idx}
                className="text-lg text-gray-700 mb-6 leading-relaxed"
              >
                {text}
              </p>
            ))}

            {/* Bullet Points Section */}
            <ul className="list-disc pl-6 text-lg text-gray-700 mb-6 space-y-4">
              {section.points.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-linkedin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg text-gray-700 leading-relaxed">
              {section.conclusion}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsPage;
