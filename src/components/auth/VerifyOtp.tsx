import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../common/axiosConfig";
import toast from "react-hot-toast";

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

      console.log(storedData, "kjsbcjhdbcuweb")

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
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col justify-center items-center py-12 p-5">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-8">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="">
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
                className="w-12 h-12 text-center text-3xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            ))}
          </div>
          <button
            type="submit"
            className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-300 ${
              isLoading ? "cursor-wait" : "hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {/* <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn't receive an OTP?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Resend OTP
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
};
