import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../common/axiosConfig";
import {toast} from "sonner";
import verifyOtp from "../../images/Enter OTP-amico.svg";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Extract user type from query parameters or state
  const userType =
    new URLSearchParams(location.search).get("userType") || "candidate";

  // Handle OTP input change
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (value.length > 1) return; // Restrict to single-digit input

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus to the next input if it's not the last one
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .replace(/[^0-9]/g, "");
    if (/^\d{6}$/.test(pastedData)) {
      const updatedOtp = pastedData.split("").slice(0, 6);
      setOtp(updatedOtp);
      otpRefs.current[5]?.focus(); // Focus on the last input after paste
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storedData = JSON.parse(sessionStorage.getItem("userData") || "{}");

      let apiEndpoint = "";
      switch (userType) {
        case "corporate":
          apiEndpoint = "/corporate/verifyOtpAndRegister";
          break;
        case "interviewer":
          apiEndpoint = "/interviewer/verifyOtpAndRegister";
          break;
        default:
          apiEndpoint = "/candidate/verifyOtpAndRegister";
      }

      const response = await axiosInstance.post(apiEndpoint, {
        otp: otp.join(""),
        ...storedData,
      });

      setIsLoading(false);

      if (response.data.success) {
        toast.success("OTP Verified Successfully!");
        sessionStorage.removeItem("userData");
        navigate(`/${userType}-login`);
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred, please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Split Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Section: Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden md:block rounded-lg overflow-hidden shadow-xl"
        >
          <img
            src={verifyOtp}
            alt="OTP Verification Illustration"
            className="w-full h-full object-contain p-6"
          />
        </motion.div>

        {/* Right Section: Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-600 text-center">
            We have sent a 6-digit OTP to your registered email address. Please
            enter it below to verify your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-5 md:gap-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpBackspace(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-3xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:border-blue-500"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-300 ${
                isLoading ? "cursor-wait" : "hover:from-blue-700 hover:to-indigo-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Resend OTP Option */}
          {/* <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Didn't receive an OTP?{" "}
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                Resend OTP
              </span>
            </p>
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
};