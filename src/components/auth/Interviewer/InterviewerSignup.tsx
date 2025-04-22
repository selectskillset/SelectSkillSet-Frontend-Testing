import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../common/axiosConfig";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import signupImg from "../../../images/Interview-bro.svg";
import { countryData } from "../../common/countryData";
import TermsAndConditionsModal from "../../common/TermsAndConditionsModal";
import PrivacyPolicyModal from "../../common/PrivacyPolicyModal";

export const InterviewerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "",
    hasExperience: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.isoCode === "IE") || countryData[0]
  );

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyPolicy, setHasAcceptedPrivacyPolicy] =
    useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > selectedCountry.maxLength) return;
    setFormData({ ...formData, phoneNumber: numericValue });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const selected = countryData.find(
      (c) => c.isoCode === countryCode.toUpperCase()
    );
    if (selected) {
      setSelectedCountry(selected);
      setFormData({ ...formData, phoneNumber: "", countryCode: selected.code });
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, phoneNumber, hasExperience } =
      formData;

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

    if (phoneNumber.length !== selectedCountry.maxLength) {
      toast.error(
        `Phone number must be ${selectedCountry.maxLength} digits for ${selectedCountry.name}`
      );
      return false;
    }

    if (!hasAcceptedTerms) {
      toast.error("You must accept the terms and conditions to proceed.");
      return false;
    }

    if (!hasExperience) {
      toast.error(
        "You must have more than 8 years of experience to register as an interviewer"
      );
      return false;
    }

    if (!hasAcceptedPrivacyPolicy) {
      toast.error("You must accept the privacy policy to proceed.");
      return false;
    }

    return true;
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, hasExperience: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      countryCode: selectedCountry.code,
      hasAcceptedTerms,
      hasAcceptedPrivacyPolicy,
      gdprConsent: true,
    };
    sessionStorage.setItem("userData", JSON.stringify(payload));
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/interviewer/register",
        payload
      );
      setIsLoading(false);
      if (response.data) {
        toast.success("Registration successful");
        navigate("/verify-otp?userType=interviewer");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred, please try again later");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8 ">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-dark">
          Join as an Interviewer
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-secondary-dark">
          Connect with top talent and help shape their careers.
        </p>
        <img src={signupImg} alt="Sign Up" className="w-3/4 max-w-md" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-primary-light/20">
          <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
            Interviewer Signup
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-primary-dark"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-light/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-primary-dark"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-primary-light/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-dark"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-primary-light/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-dark"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-primary-light/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform cursor-pointer text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Country Selection */}
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-primary-dark"
              >
                Country
              </label>
              <div className="relative">
                <div className="relative flex items-center border border-primary-light/30 rounded-lg mt-1 p-2 bg-white">
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
                    className="w-full pl-6 pr-6 py-1 border-none bg-transparent outline-none focus:ring-0 appearance-none text-primary-dark"
                    required
                  >
                    {countryData.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.emoji} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="text-primary" />
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-primary-dark"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full p-3 border border-primary-light/30 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Enter your phone number (${selectedCountry.maxLength} digits)`}
                required
              />
            </div>

            <div className="flex items-center space-x-2 my-3">
              <input
                type="checkbox"
                id="experience"
                checked={formData.hasExperience}
                onChange={handleExperienceChange}
                className="h-5 w-5 text-primary border-primary-light/30 rounded focus:ring-primary"
              />
              <label htmlFor="experience" className="text-sm text-primary-dark">
                I confirm that I have more than 8 years of professional
                experience
              </label>
            </div>

            <div className="space-y-4 my-5">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-primary border-primary-light/30 rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-primary-dark">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-primary underline hover:text-primary-dark"
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
                  className="h-5 w-5 text-primary border-primary-light/30 rounded focus:ring-primary"
                />
                <label htmlFor="privacy" className="text-sm text-primary-dark">
                  I accept the{" "}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-primary underline hover:text-primary-dark"
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
              className={`w-full text-white py-3 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 ${
                isLoading ? "cursor-wait opacity-90" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-primary-dark">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/interviewer-login")}
                className="text-primary cursor-pointer hover:underline hover:text-primary-dark"
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

export default InterviewerSignup;
