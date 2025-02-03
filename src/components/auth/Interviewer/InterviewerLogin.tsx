import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../common/axiosConfig";
import { Eye, EyeOff } from "lucide-react"; 

export const InterviewerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  // Validation function
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
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
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message || "An error occurred, please try again later";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Interviewer Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-0 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "cursor-wait" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/interviewer-signup")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
