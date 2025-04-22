import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Building, Send, Phone } from "lucide-react";
import { motion } from "framer-motion";
import requestDemo from "../../images/RequestDemo.svg";
import axiosInstance from "../../components/common/axiosConfig";

const RequestDemoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company) {
      return toast.error("Please fill in all required fields");
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/demo/add-request-demo",
        formData
      );

      if (response.data.success) {
        toast.success("Demo request submitted successfully!");
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
        });
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(124, 58, 237, 0.2)",
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center py-12">
      <div className="container mx-auto px-6 lg:px-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Section - Visual */}
          <motion.div
            className="hidden lg:block relative rounded-xl overflow-hidden h-full"
            variants={itemVariants}
          >
            <img
              src={requestDemo}
              alt="Request Demo"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-center"
              >
                <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                  Transform Your Hiring Process
                </h2>
                <p className="text-lg font-medium drop-shadow">
                  Experience seamless talent acquisition with our platform
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Section - Form */}
          <motion.div
            className="bg-white rounded-xl p-8 shadow-2xl space-y-6 border border-gray-100"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl font-extrabold text-primary mb-4">
                Request a Demo
              </h2>
              <p className="text-gray-600">
                Let us show you how Selectskillset can revolutionize your workflow
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  placeholder="Full Name"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  placeholder="Work Email"
                />
              </motion.div>

              {/* Company Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             transition-all duration-200"
                  placeholder="Company Name"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                            transition-all duration-200 resize-none"
                  placeholder="Tell us about your needs..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                className={`w-full py-3 rounded-lg text-white font-medium
                           ${isLoading
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-primary to-secondary"
                          }`}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    Request Demo <Send className="inline-block ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Contact Information */}
            <motion.div
              className="mt-8 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-600 flex items-center justify-center">
                <Mail className="mr-2 text-primary" /> Email us at{" "}
                <a
                  href="mailto:selectskillset@gmail.com"
                  className="text-primary font-medium underline ml-1 hover:text-primaryDark"
                >
                  selectskillset@gmail.com
                </a>
              </p>
              {/* <p className="text-gray-600 flex items-center justify-center">
                <Phone className="mr-2 text-primary" /> Call us at{" "}
                <a
                  href="tel:+1234567890"
                  className="text-primary font-medium underline ml-1 hover:text-primaryDark"
                >
                  +1 (234) 567-890
                </a>
              </p> */}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestDemoPage;