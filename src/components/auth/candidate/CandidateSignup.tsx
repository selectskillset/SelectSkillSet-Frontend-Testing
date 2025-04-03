import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../common/axiosConfig";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import candidateSignup from "../../../images/candidateSignup.svg";
import { countryData } from "../../common/countryData";
import TermsAndConditionsModal from "../../common/TermsAndConditionsModal";
import PrivacyPolicyModal from "../../common/PrivacyPolicyModal";

export const CandidateSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.isoCode === "IE") || countryData[0]
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyPolicy, setHasAcceptedPrivacyPolicy] =
    useState(false);

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
    const { firstName, lastName, email, password, phoneNumber } = formData;

    // Check for empty fields
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      toast.error("Please fill in all fields");
      return false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    // Validate password
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return false;
    }

    // Validate phone number
    if (phoneNumber.length !== selectedCountry.maxLength) {
      toast.error(
        `Phone number must be ${selectedCountry.maxLength} digits for ${selectedCountry.name}`
      );
      return false;
    }

    // Validate terms and conditions
    if (!hasAcceptedTerms) {
      toast.error("You must accept the terms and conditions to proceed.");
      return false;
    }

    if (!hasAcceptedPrivacyPolicy) {
      toast.error("You must accept the privacy policy to proceed.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      countryCode: selectedCountry.code, // Include the full phone number with country code
      hasAcceptedTerms,
      hasAcceptedPrivacyPolicy, // Include privacy policy acceptance
      gdprConsent: true, // Explicit GDPR consent
    };
    sessionStorage.setItem("userData", JSON.stringify(payload));

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/candidate/register", payload);

      if (response.data.success) {
        toast.success("Registration successful");
        navigate("/verify-otp?userType=candidate");
      } else {
        // Handle non-success response from server (200 status but success: false)
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      // Handle Axios errors (non-2xx status codes)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred, please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col bg-gray-50 justify-center items-center w-1/2 bg-gradient-to-br text-white p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#0077B5]">
          Join as a Candidate
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-[#0A66C2]">
          Find your dream job and take your career to the next level.
        </p>
        <img src={candidateSignup} alt="Sign Up" className="w-3/4 max-w-md" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Candidate Signup
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
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
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
              />
            </div>

            <div className="space-y-4 my-5">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-[#0A66C2] border-gray-300 rounded focus:ring-[#0A66C2]"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-[#0A66C2] underline hover:text-[#005885]"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={hasAcceptedPrivacyPolicy}
                  onChange={(e) =>
                    setHasAcceptedPrivacyPolicy(e.target.checked)
                  }
                  className="h-5 w-5 text-[#0A66C2] border-gray-300 rounded focus:ring-[#0A66C2]"
                />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  I accept the{" "}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-[#0A66C2] underline hover:text-[#005885]"
                  >
                    Privacy Policy
                  </button>{" "}
                  and agree to GDPR data protection terms
                </label>
              </div>
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
                onClick={() => navigate("/candidate-login")}
                className="text-[#0A66C2] cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
          {isTermsModalOpen && (
            <TermsAndConditionsModal
              onClose={() => setIsTermsModalOpen(false)}
            />
          )}

          {isPrivacyModalOpen && (
            <PrivacyPolicyModal onClose={() => setIsPrivacyModalOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateSignup;
