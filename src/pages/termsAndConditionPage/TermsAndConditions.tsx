import {
  ChevronRight,
  Info,
  AlertCircle,
  Shield,
  FileText,
  Lock,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const termsData = [
  {
    id: 1,
    title: "Definitions",
    icon: <Info size={24} className="text-[#0A66C2]" />,
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>
          <strong>Company</strong>: Refers to SelectSkillSet, registered in
          Ireland.
        </li>
        <li>
          <strong>User</strong>: Refers to anyone who accesses or uses our
          website and services.
        </li>
        <li>
          <strong>Services</strong>: Refers to our mock interview platform and
          associated content.
        </li>
      </ul>
    ),
  },
  {
    id: 2,
    title: "Eligibility",
    icon: <AlertCircle size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        You must be at least 18 years old to use our website and services. By
        using the website, you confirm that you meet this requirement.
      </p>
    ),
  },
  {
    id: 3,
    title: "Services Offered",
    icon: <Shield size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        SelectSkillSet provides mock interview sessions with professionals to
        help users improve their interview skills. We do not guarantee job
        placement or any employment outcome.
      </p>
    ),
  },
  {
    id: 4,
    title: "User Responsibilities",
    icon: <FileText size={24} className="text-[#0A66C2]" />,
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Provide accurate and complete information during registration.</li>
        <li>Do not use our website for unlawful or fraudulent activities.</li>
        <li>Behave professionally and respectfully during mock interviews.</li>
      </ul>
    ),
  },
  {
    id: 5,
    title: "Payments and Refund Policy",
    icon: <Lock size={24} className="text-[#0A66C2]" />,
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Fees are clearly stated at the time of booking.</li>
        <li>Payments must be made in advance.</li>
        <li>
          Refunds are provided only if a session is canceled by us or due to
          exceptional circumstances.
        </li>
      </ul>
    ),
  },
  {
    id: 6,
    title: "Intellectual Property",
    icon: <Info size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        All content, trademarks, logos, and materials remain our property.
        Unauthorized use is prohibited.
      </p>
    ),
  },
  {
    id: 7,
    title: "Limitation of Liability",
    icon: <AlertCircle size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        We are not responsible for direct or indirect losses resulting from the
        use of our services.
      </p>
    ),
  },
  {
    id: 8,
    title: "Privacy Policy",
    icon: <Lock size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        Your personal data will be handled in accordance with our{" "}
        <a
          href="/privacy-policy"
          className="text-[#0A66C2] hover:underline transition-colors duration-300"
        >
          Privacy Policy
        </a>
        .
      </p>
    ),
  },
  {
    id: 9,
    title: "Termination",
    icon: <AlertCircle size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        We reserve the right to suspend or terminate access for violations of
        these Terms and Conditions.
      </p>
    ),
  },
  {
    id: 10,
    title: "Governing Law",
    icon: <Shield size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        These Terms are governed by Irish law, and disputes are subject to the
        courts of Ireland.
      </p>
    ),
  },
  {
    id: 11,
    title: "Amendments",
    icon: <Info size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        We may update these Terms from time to time. Significant changes will be
        communicated to users.
      </p>
    ),
  },
  {
    id: 12,
    title: "Contact Us",
    icon: <Mail size={24} className="text-[#0A66C2]" />,
    content: (
      <p className="text-gray-700">
        For any questions, please email us at{" "}
        <a
          href="mailto:contact@selectskillset.com"
          className="text-[#0A66C2] hover:underline transition-colors duration-300"
        >
          contact@selectskillset.com
        </a>
        .
      </p>
    ),
  },
];

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen  font-sans text-gray-800">
      <main className="container mx-auto p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <motion.div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-3xl font-extrabold text-[#0A66C2] tracking-tight">
              Terms and Conditions
            </h2>
            <p className="text-base text-gray-600">
              Effective Date: 11 December 2024
            </p>
          </motion.div>

          {/* Terms Cards */}
          {termsData.map((term) => (
            <motion.div
              key={term.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
            >
              <div className="flex items-center gap-4">
                {term.icon}
                <h3 className="text-2xl font-semibold text-gray-800">
                  {term.title}
                </h3>
              </div>
              <div>{term.content}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
