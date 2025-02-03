import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../../common/axiosConfig";
import { Eye, EyeOff } from "lucide-react";
import { countryData } from "../../common/countryData";

export const CandidateSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    countryCode: "+1",
  });

  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > selectedCountry.maxLength) return;
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCountryChange = (code: string) => {
    const country = countryData.find((item) => item.code === code);
    if (country) {
      setSelectedCountry(country);
      setFormData({
        ...formData,
        countryCode: country.code,
        mobile: "",
      });
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, mobile, countryCode } =
      formData;

    if (!firstName || !lastName || !email || !password || !mobile) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (mobile.length !== selectedCountry.maxLength) {
      toast.error(`Phone number must be ${selectedCountry.maxLength} digits`);
      return false;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("userData", JSON.stringify(formData));
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/candidate/register",
        formData
      );

      setIsLoading(false);

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful");
        navigate("/verify-otp");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred, please try again later");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Candidate Signup
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-0 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </div>
          </div>

          {/* Country Code and Phone Number */}
          <div className="mb-6 flex items-center space-x-3">
            <div className="w-1/3">
              <label
                htmlFor="countryCode"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryData.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-2/3">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={selectedCountry.maxLength}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your number"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "cursor-wait" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/candidate-login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
