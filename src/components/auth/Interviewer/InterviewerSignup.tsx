import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../common/axiosConfig";
import { Eye, EyeOff } from "lucide-react";
import { MuiTelInput } from "mui-tel-input";
import signupImg from "../../../images/signup.svg";
import { countryData } from "../../common/countryData";

export const InterviewerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone number validity
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.isoCode === "IE")
  );
  const [maxLength, setMaxLength] = useState(selectedCountry?.maxLength || 10);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle phone number change
  const handlePhoneChange = (value: string, isValid: boolean) => {
    // Extract the numeric part of the phone number (excluding the country code)
    const countryCodeLength =
      selectedCountry?.code.replace(/\D/g, "").length || 0;
    const numericValue = value.replace(/\D/g, ""); // Remove all non-numeric characters
    const phoneNumberDigits = numericValue.slice(countryCodeLength); // Exclude country code

    // Restrict input if it exceeds the maximum numeric length
    if (phoneNumberDigits.length > maxLength) return;

    setFormData({ ...formData, phoneNumber: value }); // Preserve formatted value
    setIsPhoneValid(isValid); // Update phone validity state
  };

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    const selected = countryData.find(
      (c) => c.isoCode === countryCode.toUpperCase()
    );
    if (selected) {
      setSelectedCountry(selected);
      setMaxLength(selected.maxLength); // Update max length
      setFormData({ ...formData, phoneNumber: "" }); // Reset phone number when country changes
    }
  };

  // Form validation
  const validateForm = () => {
    const { firstName, lastName, email, password, phoneNumber } = formData;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return false;
    }

    // Extract numeric characters for validation (excluding the country code)
    const countryCodeLength =
      selectedCountry?.code.replace(/\D/g, "").length || 0;
    const numericPhoneNumber = phoneNumber
      .replace(/\D/g, "")
      .slice(countryCodeLength);

    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number for the selected country");
      return false;
    }

    if (numericPhoneNumber.length !== maxLength) {
      toast.error(`Phone number must be ${maxLength} digits`);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/interviewer/register",
        formData
      );
      setIsLoading(false);
      if (response.data.success) {
        toast.success("Registration successful");
        navigate("/interviewer-login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred, please try again later");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col bg-gray-50 justify-center items-center w-1/2 bg-gradient-to-br text-white p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#0077B5]">
          Join as an Interviewer
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-[#0A66C2]">
          Connect with top talent and help shape their careers.
        </p>
        <img src={signupImg} alt="Sign Up" className="w-3/4 max-w-md" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Interviewer Signup
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Phone Input with Flags */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <MuiTelInput
                value={formData.phoneNumber}
                onChange={(value, isValid) => handlePhoneChange(value, isValid)}
                onCountryChange={(countryCode) =>
                  handleCountryChange(countryCode)
                }
                defaultCountry="IE"
                fullWidth
                variant="outlined"
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "48px",
                  },
                }}
              />
              {!isPhoneValid && (
                <p className="text-red-500 text-xs mt-1">
                  Invalid phone number for the selected country
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full text-white py-3 rounded-lg bg-[#0077B5] focus:outline-none focus:ring-2 focus:ring-[#0A66C2] transition duration-300 ${
                isLoading ? "cursor-wait" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/interviewer-login")}
                className="text-[#0A66C2] cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerSignup;
