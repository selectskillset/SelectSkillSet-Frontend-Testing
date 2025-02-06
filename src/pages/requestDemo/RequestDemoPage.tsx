import React, { useState } from "react";
import requestDemo from "../../images/RequestDemo.svg";
import { Toaster, toast } from "react-hot-toast";

const RequestDemoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission logic
    console.log("Form Data Submitted:", formData);

    // Show success toast notification
    toast.success(
      "Thank you for requesting a demo! We will get back to you soon.",
      {
        position: "top-center",
      }
    );

    // Reset form data after submission
    setFormData({
      name: "",
      email: "",
      company: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      {/* Toaster for Notifications */}
      <Toaster />

      {/* Container */}
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden lg:flex">
        {/* Left Section: Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={requestDemo}
            alt="Request Demo"
            className="absolute inset-0 w-full h-full object-contain opacity-90"
          />
          {/* Gradient Overlay */}
          {/* Text Content */}
          <div className="relative z-10 p-8 text-[#0077B5] backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 text-shadow-sm">
              Request a Demo
            </h2>
            <p className="text-lg font-medium leading-relaxed">
              Discover how our platform can help you streamline your workflow
              and achieve your goals.
            </p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="lg:w-1/2 p-8 space-y-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Get in Touch
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
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
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition duration-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
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
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition duration-300"
                placeholder="Enter your email address"
              />
            </div>

            {/* Company Field */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition duration-300"
                placeholder="Enter your company name"
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition duration-300 resize-none"
                placeholder="Tell us more about your needs..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0077B5] text-white py-3 rounded-lg "
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
