import React, { useState } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import Loader from "../../components/ui/Loader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      const { token } = response.data;
      sessionStorage.setItem("adminToken", token);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef] px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border-t-4 border-[#0073b1]"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-[#0073b1]">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute top-6 left-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full p-3 px-10 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute top-6 left-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full p-3 px-10 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute top-5 right-3 text-gray-500"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={25} />
                    ) : (
                      <Eye size={25} />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-sm font-medium text-white bg-[#0073b1] hover:bg-[#005582] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0073b1] rounded-md shadow-md ${
                  loading && "opacity-70 cursor-not-allowed"
                }`}
              >
                Login
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminLogin;
