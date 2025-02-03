import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { countryData } from "../../components/common/countryData";

const EditCorporateProfile: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs and loader
  const [profileData, setProfileData] = useState({
    contactName: "",
    email: "",
    profilePhoto: "",
    countryCode: "",
    phoneNumber: "",
    companyName: "",
    location: "",
    industry: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch corporate profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/corporate/getProfile");
        const { corporate } = response.data || {};
        setProfileData({
          contactName: corporate?.contactName || "",
          email: corporate?.email || "",
          profilePhoto: corporate?.profilePhoto || "",
          countryCode: corporate?.countryCode || "",
          phoneNumber: corporate?.phoneNumber || "",
          companyName: corporate?.companyName || "",
          location: corporate?.location || "",
          industry: corporate?.industry || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put("/corporate/updateProfile", profileData);
      toast.success("Profile updated successfully!");
      navigate("/corporate-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Edit Corporate Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={profileData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="profilePhoto"
                  className="block text-sm font-medium text-gray-600"
                >
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  id="profilePhoto"
                  name="profilePhoto"
                  value={profileData.profilePhoto}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="countryCode"
                  className="block text-sm font-medium text-gray-600"
                >
                  Country Code
                </label>
                <select
                  id="countryCode"
                  name="countryCode"
                  value={profileData.countryCode}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                >
                  <option value="">Select Country</option>
                  {countryData.map((country) => (
                    <option key={country.isoCode} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  required
                  maxLength={
                    profileData.countryCode
                      ? countryData.find(
                          (country) => country.code === profileData.countryCode
                        )?.maxLength
                      : 15
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-600"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-600"
                >
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#0077b5] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0077b5] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#005a94] focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditCorporateProfile;
