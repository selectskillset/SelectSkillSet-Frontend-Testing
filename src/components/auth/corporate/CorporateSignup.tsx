import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../common/axiosConfig";
import toast from "react-hot-toast";
import corporateSignup from "../../../images/corporateSignup.svg"; // Import your image
import { countryData } from "../../common/countryData";
import { ChevronDown } from "lucide-react";

export const CorporateSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    password: "",
    phoneNumber: "", // Store the full phone number (e.g., "+91 9373960682")
    countryCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.isoCode === "IE") || countryData[0] // Default to India or first country
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Ensure only digits are entered
    const numericValue = value.replace(/\D/g, "");

    // Restrict input if it exceeds the maximum numeric length
    if (numericValue.length > selectedCountry.maxLength) return;

    setFormData({ ...formData, phoneNumber: numericValue });
  };

  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const selected = countryData.find(
      (c) => c.isoCode === countryCode.toUpperCase()
    );
    if (selected) {
      setSelectedCountry(selected);
      setFormData({ ...formData, phoneNumber: "", countryCode: selected.code }); // Reset phone number when country changes
    }
  };
  // Form validation
  const validateForm = () => {
    const { companyName, contactName, email, password, phoneNumber } = formData;
    const newErrors: any = {};

    if (!companyName) newErrors.companyName = "Company name is required.";
    if (!contactName) newErrors.contactName = "Contact name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "A valid email is required.";
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (phoneNumber.length !== selectedCountry.maxLength)
      newErrors.phoneNumber = `Phone number must be ${selectedCountry.maxLength} digits for ${selectedCountry.name}.`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      countryCode: selectedCountry.code,
    };
    sessionStorage.setItem("userData", JSON.stringify(payload));

    setLoading(true);
    try {
      const response = await axiosInstance.post("/corporate/register", payload);
      const { message, success } = response.data;
      if (success) {
        toast.success("Registration successful");
        sessionStorage.setItem("userData", JSON.stringify(formData));
        navigate("/verify-otp?userType=corporate");
      } else {
        toast.error(message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col bg-gray-50 justify-center items-center w-1/2 bg-gradient-to-br text-white p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#0077B5]">
          Join as a Corporate
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-[#0077B5]">
          Connect with top talent and grow your business.
        </p>
        <img src={corporateSignup} alt="Sign Up" className="w-3/4 max-w-md" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Corporate Signup
          </h2>
          {loading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A66C2]"></div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Your company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
            </div>

            {/* Contact Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Your name"
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm">{errors.contactName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="company@domain.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Country Selection */}
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="relative">
                {/* Custom dropdown wrapper */}
                <div className="relative flex items-center border border-gray-300 rounded-lg mt-1 p-2 bg-white">
                  {/* Country flag inside the dropdown */}
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-8 h-5"
                  />
                  <select
                    id="country"
                    name="country"
                    value={selectedCountry.isoCode}
                    onChange={handleCountryChange}
                    className="w-full pl-6 pr-6 py-1 border-none bg-transparent outline-none focus:none focus:ring-none appearance-none"
                    required
                  >
                    {countryData.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.emoji} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                placeholder={`Enter your phone number (${selectedCountry.maxLength} digits)`}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-[#0077B5] hover:bg-[#0A66C2] text-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              } transition duration-300`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/corporate-login")}
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

export default CorporateSignup;
