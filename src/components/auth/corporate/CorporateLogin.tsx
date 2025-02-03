import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../common/axiosConfig";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";

export const CorporateLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Corporate Login
        </h2>
        {loading && <Loader />} 
        <form onSubmit={handleSubmit}>
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/corporate-signup")}
              className="text-blue-500 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
