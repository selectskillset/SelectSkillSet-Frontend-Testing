import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../common/axiosConfig";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";
import { countryData } from "../../common/countryData";

export const CorporateSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: countryData[0].code,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countryData.find((c) => c.code === e.target.value);
    if (country) {
      setSelectedCountry(country);
      setFormData({
        ...formData,
        countryCode: country.code,
      });
    }
  };

  const validateForm = () => {
    const { companyName, contactName, email, password, phoneNumber } = formData;
    const newErrors: any = {};

    if (!companyName) newErrors.companyName = "Company name is required.";
    if (!contactName) newErrors.contactName = "Contact name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "A valid email is required.";
    if (!password || password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (
      !/^\d+$/.test(phoneNumber) ||
      phoneNumber.length !== selectedCountry.maxLength
    )
      newErrors.phoneNumber = `Phone number must be ${selectedCountry.maxLength} digits.`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/corporate/signup", formData);
      const { message, success } = response.data;

      if (success) {
        toast.success(message || "Account created successfully!");
        setTimeout(() => navigate("/corporate-login"), 2000);
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Corporate Signup
        </h2>
        {loading && <Loader />}
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleCountryChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            >
              {countryData.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder={`Enter ${selectedCountry.maxLength} digits`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/corporate-login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
