import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Send, CheckCircle } from "lucide-react";
import bugFix from "../../images/Bug fixing-amico.svg";

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate submission (replace with actual API call if needed)
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", issueType: "", description: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Split Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Section: Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden md:block rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={bugFix}
            alt="Report Issue Illustration"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right Section: Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {isSubmitted ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-semibold text-green-700">
                Issue Reported Successfully!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for reporting the issue. Our team will review it
                shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Report an Issue
                </h1>
                <p className="text-sm text-gray-600">
                  Let us know about any issues you're facing. We'll get back to
                  you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="johndoe@example.com"
                  />
                </div>

                {/* Issue Type Field */}
                <div className="mb-4">
                  <label
                    htmlFor="issueType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type of Issue
                  </label>
                  <select
                    id="issueType"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select an option</option>
                    <option value="bug">Bug/Error</option>
                    <option value="feature">Feature Request</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description Field */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe the issue in detail..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportIssue;
