import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Mail, Building, Send } from "lucide-react";
import requestDemo from "../../images/RequestDemo.svg";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Demo request submitted successfully!");
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Visual */}
          <div className="hidden lg:block relative rounded-lg overflow-hidden">
            <img
              src={requestDemo}
              alt="Request Demo"
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0077B5]/20 to-[#004182]/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                  Transform Your Hiring Process
                </h2>
                <p className="text-lg font-medium drop-shadow">
                  Experience seamless talent acquisition with our platform
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <h2 className="text-3xl font-extrabold text-[#0077B5] mb-6 text-center">
              Request a Demo
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Let us show you how Selectskillset can revolutionize your workflow
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B5]" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                  placeholder="Full Name"
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B5]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                  placeholder="Work Email"
                />
              </div>

              {/* Company Field */}
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B5]" />
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                  placeholder="Company Name"
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-[#0077B5] resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white transition-all 
                           duration-300 ${
                             isLoading
                               ? "bg-gray-300 cursor-not-allowed"
                               : "bg-gradient-to-r from-[#0077B5] to-[#004182] hover:from-[#005885] hover:to-[#003366]"
                           }`}
              >
                {isLoading ? "Submitting..." : "Request Demo"}
                {!isLoading && <Send className="inline-block ml-2 w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
