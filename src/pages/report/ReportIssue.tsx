import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import bugFix from "../../images/bugFix.svg";

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Issue reported successfully!", {
        description: "Our team will review it shortly.",
      });
      setFormData({ name: "", email: "", issueType: "", description: "" });
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Image Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex items-center justify-center p-8"
        >
          <img
            src={bugFix}
            alt="Report Issue Illustration"
            className="w-full h-full  object-contain"
            loading="lazy"
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8"
        >
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Report an Issue
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Found a problem? Let us know and we'll work to fix it quickly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="johndoe@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="issueType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Issue Type
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select issue type</option>
                  <option value="bug">Bug/Error</option>
                  <option value="feature">Feature Request</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Describe the issue in detail..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  Submit Report
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportIssue;
