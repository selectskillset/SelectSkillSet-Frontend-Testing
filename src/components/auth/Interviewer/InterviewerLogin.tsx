import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../common/axiosConfig";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import interviewerLoginImage from "../../../images/login.svg";

export const InterviewerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/interviewer/login", {
        email,
        password,
      });
      setIsLoading(false);

      if (response.data.success) {
        sessionStorage.setItem("interviewerToken", response.data.token);
        toast.success("Login successful");
        navigate("/interviewer-dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred, please try again later";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8"
      >
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-dark">
          Welcome Back, Interviewer
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-secondary-dark">
          Sign in to access your interviewer dashboard and conduct interviews
        </p>
        <motion.img
          src={interviewerLoginImage}
          alt="Interviewer Login"
          className="w-3/5 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-primary-light/20">
          <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
            Interviewer Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-dark"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-primary-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-dark"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-primary-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform cursor-pointer text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary underline hover:text-primary-dark"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full text-white py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 ${
                isLoading ? "cursor-wait opacity-90" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-primary-dark">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/interviewer-signup")}
                className="text-primary underline hover:text-primary-dark font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewerLogin;
