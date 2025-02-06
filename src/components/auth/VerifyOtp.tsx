import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../common/axiosConfig";
import toast from "react-hot-toast";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Allow only numbers
    if (/[^0-9]/.test(value)) return;

    const updatedOtp = [...otp];

    // Handle single-digit input
    updatedOtp[index] = value.slice(0, 1);
    setOtp(updatedOtp);

    // Move focus to the next input if it's not the last one
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpBackspace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("text").trim();

    // Allow only numbers and check if the pasted data has exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const updatedOtp = pastedData.split("").slice(0, 6);
      setOtp(updatedOtp);

      // Move focus to the last input after paste
      document.getElementById(`otp-5`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const storedData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const { firstName, lastName, email, phoneNumber, password } =
      storedData;

    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/candidate/verifyOtpAndRegister",
        {
          otp: otp.join(""),
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
     
        }
      );

      setIsLoading(false);

      if (response.data.success) {
        toast.success("OTP Verified Successfully!");
        sessionStorage.removeItem("userData");
        navigate("/candidate-login");
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
                maxLength={1} // Allow only one digit
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
                onPaste={index === 0 ? handlePaste : undefined} // Handle paste only on the first input
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

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn't receive an OTP?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Resend OTP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
