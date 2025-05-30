import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../common/axiosConfig";
import { motion } from "framer-motion";
import resetPasswordImage from "../../images/Reset password-amico.svg"; 

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Color scheme
 
  const gradient = `bg-gradient-to-r from-primary to-secondary`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-center",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(`/auth/resetpassword/${token}`, { password });
      toast.success("Password reset successfully! Redirecting to login...", {
        position: "top-center",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error resetting password",
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
              className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-8"
            >
              <div className="max-w-md">
                <motion.img
                  src={resetPasswordImage}
                  alt="Reset Password"
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
                    Secure Password Reset
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Create a new strong password to protect your account.
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
                  className={`w-16 h-16 ${gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Reset Your Password
                </h1>
                <p className="text-gray-500">
                  Create a new secure password for your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                    <span className="text-xs text-gray-500 ml-1">
                      (min 8 characters)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 border-gray-300 hover:border-primary shadow-sm`}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 hover:text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {showPassword ? (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </>
                        ) : (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          password.length > 0
                            ? password.length < 4
                              ? "bg-red-500"
                              : password.length < 8
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full ${
                          password.length > 3
                            ? password.length < 8
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          password.length > 7 ? "bg-green-500" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength:{" "}
                      <span
                        className={`font-medium ${
                          password.length > 0
                            ? password.length < 4
                              ? "text-red-500"
                              : password.length < 8
                              ? "text-yellow-500"
                              : "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {password.length > 0
                          ? password.length < 4
                            ? "Weak"
                            : password.length < 8
                            ? "Medium"
                            : "Strong"
                          : "None"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500"
                        : confirmPassword && password === confirmPassword
                        ? "border-green-500"
                        : "border-gray-300 hover:border-indigo-500"
                    } shadow-sm`}
                    required
                    minLength={8}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-1 text-sm text-green-500">
                      Passwords match!
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${gradient} text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
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
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </form>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 text-center">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className={`text-primary font-medium hover:underline`}
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