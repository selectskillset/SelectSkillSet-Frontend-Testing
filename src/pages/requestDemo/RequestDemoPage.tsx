import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Building, Send } from "lucide-react";
import { motion } from "framer-motion";
import requestDemo from "../../images/demo.svg";
import axiosInstance from "../../components/common/axiosConfig";

// Animation constants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02, boxShadow: "0 4px 20px rgba(124, 58, 237, 0.25)" },
  tap: { scale: 0.98 },
};

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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name || !formData.email || !formData.company) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/demo/add-request-demo",
        formData
      );

      if (response.data.success) {
        toast.success("Demo request submitted successfully!");
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(
          response.data.message || "Submission failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/5 flex items-center py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Visual Section */}
          <motion.div
            className="hidden lg:flex items-center justify-center p-8 "
            variants={itemVariants}
          >
            <img
              src={requestDemo}
              alt="Request Demo"
              className="w-full max-w-xl object-contain"
              loading="lazy"
            />
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                Request a Demo
              </h2>
              <p className="text-gray-600">
                Discover how Selectskillset can optimize your workflow
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id: "name", icon: User, placeholder: "Full Name" },
                { id: "email", icon: Mail, placeholder: "Work Email" },
                { id: "company", icon: Building, placeholder: "Company Name" },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/80" />
                  <input
                    type={field.id === "email" ? "email" : "text"}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30
                             transition-all duration-200 bg-white"
                    placeholder={field.placeholder}
                  />
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30
                           transition-all duration-200 resize-none bg-white"
                  placeholder="Additional details about your needs..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                className={`w-full py-3.5 text-sm font-medium rounded-xl transition-colors
                          ${
                            isLoading
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary-dark"
                          }`}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Request Demo <Send className="w-4 h-4" />
                  </span>
                )}
              </motion.button>
            </form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* <p className="text-gray-600 flex items-center justify-center gap-2">
                <Mail className="text-primary" />
                <a
                  href="mailto:selectskillset@gmail.com"
                  className="text-primary hover:text-primary-dark underline underline-offset-4"
                >
                  selectskillset@gmail.com
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
