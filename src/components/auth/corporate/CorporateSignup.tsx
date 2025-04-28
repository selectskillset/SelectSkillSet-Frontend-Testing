import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../common/axiosConfig";
import { toast } from "sonner";
import corporateSignup from "../../../images/corporate.svg";
import { countryData } from "../../common/countryData";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import TermsAndConditionsModal from "../../common/TermsAndConditionsModal";
import PrivacyPolicyModal from "../../common/PrivacyPolicyModal";
import { motion } from "framer-motion";

export const CorporateSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.isoCode === "IE") || countryData[0]
  );
  const [showPassword, setShowPassword] = useState(false);
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
    const { companyName, contactName, email, password, phoneNumber } = formData;
    const newErrors: Record<string, string> = {};

    if (!companyName) newErrors.companyName = "Company name is required";
    if (!contactName) newErrors.contactName = "Contact name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (phoneNumber.length !== selectedCountry.maxLength)
      newErrors.phoneNumber = `Phone number must be ${selectedCountry.maxLength} digits`;

    if (!hasAcceptedTerms) {
      toast.error("You must accept the terms and conditions to proceed.");
      return false;
    }

    if (!hasAcceptedPrivacyPolicy) {
      toast.error("You must accept the privacy policy to proceed.");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const response = await axiosInstance.post("/corporate/register", payload);
      if (response.data) {
        toast.success("Registration successful");
        navigate("/verify-otp?userType=corporate");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
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
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8"
      >
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-dark">
          Join as a Corporate
        </h1>
        <p className="text-base mb-6 text-center max-w-md text-secondary-dark">
          Connect with top talent and grow your business
        </p>
        <motion.img
          src={corporateSignup}
          alt="Sign Up"
          className="w-3/5 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-primary-light/20">
          <h2 className="text-2xl font-semibold text-center mb-6 text-primary-dark">
            Corporate Signup
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-dark">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.companyName
                    ? "border-red-500"
                    : "border-primary-light/30"
                } rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Your company name"
                required
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Contact Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-dark">
                Contact Person
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.contactName
                    ? "border-red-500"
                    : "border-primary-light/30"
                } rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Your name"
                required
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-dark">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.email ? "border-red-500" : "border-primary-light/30"
                } rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="company@domain.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-primary-dark">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.password ? "border-red-500" : "border-primary-light/30"
                } rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform cursor-pointer text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Country Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-dark">
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
              <label className="block text-sm font-medium text-primary-dark">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className={`w-full p-3 border ${
                  errors.phoneNumber
                    ? "border-red-500"
                    : "border-primary-light/30"
                } rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder={`Enter your phone number (${selectedCountry.maxLength} digits)`}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
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
                onClick={() => navigate("/corporate-login")}
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
      </motion.div>
    </div>
  );
};

export default CorporateSignup;
