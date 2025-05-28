import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../common/axiosConfig";
import { motion } from "framer-motion";
import forgotPasswordImage from "../../images/Forgot password-rafiki.svg"; 

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email", { position: "top-center" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/forgotpassword", { email });
      toast.success("Password reset link sent to your email! Redirecting to login...", {
        position: "top-center",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error sending reset link",
        { position: "top-center" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-8"
            >
              <div className="max-w-md">
                <motion.img
                  src={forgotPasswordImage}
                  alt="Forgot Password"
                  className="w-full h-auto"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-6 text-center"
                >
                  <h3 className="text-xl font-semibold text-gray-700">
                    Reset Your Password
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Enter your email to receive a password reset link
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-8 sm:p-12"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-500">
                  We'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all duration-200 ${
                      email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? "border-red-500"
                        : "border-gray-300 hover:border-primary-500"
                    } shadow-sm`}
                    required
                  />
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Reset Link...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 text-center">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-primary-600 font-medium hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};