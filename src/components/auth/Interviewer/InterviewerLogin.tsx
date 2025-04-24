import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../common/axiosConfig";
import { Eye, EyeOff } from "lucide-react";

export const InterviewerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation function
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Handle form submission
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
        // Save token in sessionStorage
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8 text-[#0077B5]">
          Interviewer Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
              placeholder="Enter your password"
              required
            />
            {/* Show/Hide Password Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

         {/* Forgot Password Link */}
         <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-[#0077B5] hover:underline"
            >
              Forgot Password?
            </button>
          </div>


          {/* Login Button */}
          <button
            type="submit"
            className={`w-full text-white py-3 rounded-lg bg-gradient-to-r 
                         from-[#0077B5] to-[#004182] focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-[#0077B5] transition duration-300 
                         hover:bg-gradient-to-r hover:from-[#005885] hover:to-[#003366]
                         ${isLoading ? "cursor-wait" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/interviewer-signup")}
              className="text-[#0077B5] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewerLogin;
