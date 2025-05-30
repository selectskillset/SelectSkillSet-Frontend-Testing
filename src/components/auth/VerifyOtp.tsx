import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../common/axiosConfig";
import { toast } from "sonner";
import verifyOtp from "../../images/Enter OTP-amico.svg";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


  const gradient = `bg-gradient-to-r from-primary to-secondary`;

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
        toast.success("OTP Verified Successfully!", {
          position: "top-center",
          duration: 2000,
        });
        sessionStorage.removeItem("userData");
        navigate(`/${userType}-login`);
      } else {
        toast.error(response.data.message || "OTP verification failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred, please try again later.", {
        position: "top-center",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
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
                  src={verifyOtp}
                  alt="OTP Verification"
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
                    Secure Verification
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Enter the 6-digit code sent to your email to verify your
                    identity.
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
                  Verify Your Account
                </h1>
                <p className="text-gray-500">
                  We've sent a verification code to your email
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    6-Digit Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <motion.input
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
                        className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-secondary outline-none transition-all duration-200 ${
                          digit ? `border-primary` : "border-gray-300"
                        } hover:border-secondary shadow-sm`}
                        whileHover={{ scale: 1.05 }}
                        whileFocus={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className={`w-full ${gradient} text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
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
                      Verifying...
                    </div>
                  ) : (
                    "Verify Account"
                  )}
                </motion.button>
              </form>

              {/* <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive a code?{" "}
                  <motion.button
                    type="button"
                    className={`font-medium text-${primaryColor} hover:text-${secondaryColor} focus:outline-none`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resend OTP
                  </motion.button>
                </p>
              </div> */}

              {/* <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 text-center">
                  By verifying your account, you agree to our{" "}
                  <a href="#" className={`text-primary hover:underline`}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className={`text-secondary hover:underline`}>
                    Privacy Policy
                  </a>
                  .
                </p>
              </div> */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};