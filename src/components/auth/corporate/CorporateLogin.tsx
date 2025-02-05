import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../common/axiosConfig";
import toast from "react-hot-toast";

export const CorporateLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true); // Show loader
    try {
      const response = await axiosInstance.post("/corporate/login", {
        email,
        password,
      });
      if (response.data) {
        const { token } = response.data;
        // Store the token in sessionStorage
        sessionStorage.setItem("corporateToken", token);
        toast.success("Login successful!");
        // Redirect to the corporate dashboard
        navigate("/corporate-dashboard");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center py-12">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-8 text-[#0A66C2]">
          Corporate Login
        </h2>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A66C2]"></div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-[#0077B5] text-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            } transition duration-300`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/corporate-signup")}
              className="text-[#0A66C2] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateLogin;
