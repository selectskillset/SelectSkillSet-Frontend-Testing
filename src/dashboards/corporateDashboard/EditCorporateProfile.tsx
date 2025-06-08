import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axiosInstance from "../../components/common/axiosConfig";
import { countryData } from "../../components/common/countryData";
import { Camera, Pencil, ChevronDown } from "lucide-react";
import Loader from "../../components/ui/Loader";
import { useCorporate } from "../../context/CorporateContext";

type ProfileState = {
  contactName: string;
  email: string;
  companyName: string;
  location: string;
  industry: string;
  phoneNumber: string;
  profilePhoto: File | null;
};

const EditCorporateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileState>({
    contactName: "",
    email: "",
    companyName: "",
    location: "",
    industry: "",
    phoneNumber: "",
    profilePhoto: null,
  });
  const [existingProfilePhoto, setExistingProfilePhoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const {fetchProfile} = useCorporate()

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/corporate/getProfile");
        const profileData = data.corporate;
        const country =
          countryData.find((c) => c.code === profileData.countryCode) ||
          countryData[0];

        setSelectedCountry(country);
        setProfile({
          contactName: profileData.contactName,
          email: profileData.email,
          companyName: profileData.companyName,
          location: profileData.location,
          industry: profileData.industry,
          phoneNumber: profileData.phoneNumber,
          profilePhoto: null,
        });
        setExistingProfilePhoto(profileData.profilePhoto);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = useCallback(
    (field: keyof ProfileState, value: string) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    []
  );

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const countryCode = e.target.value;
      const selected = countryData.find(
        (c) => c.isoCode === countryCode.toUpperCase()
      );
      if (selected) {
        setSelectedCountry(selected);
        setProfile((prev) => ({ ...prev, phoneNumber: "" }));
      }
    },
    []
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/\D/g, "");
      if (numericValue.length <= selectedCountry.maxLength) {
        setProfile((prev) => ({ ...prev, phoneNumber: numericValue }));
      }
    },
    [selectedCountry.maxLength]
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.contactName.trim()) {
      newErrors.contactName = "Contact name required";
      toast.error("Contact name is required");
    }
    if (!profile.email.trim()) {
      newErrors.email = "Email required";
      toast.error("Email is required");
    }
    if (!profile.companyName.trim()) {
      newErrors.companyName = "Company name required";
      toast.error("Company name is required");
    }
    if (!profile.phoneNumber) {
      newErrors.phoneNumber = "Phone number required";
      toast.error("Phone number is required");
    }
    if (profile.phoneNumber.length !== selectedCountry.maxLength) {
      newErrors.phoneNumber = `Must be ${selectedCountry.maxLength} digits`;
      toast.error(`Phone number must be ${selectedCountry.maxLength} digits`);
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }, [profile, selectedCountry]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    const appendIfPresent = (field: string, value: any) => {
      if (value !== null && value !== undefined) formData.append(field, value);
    };

    appendIfPresent("contactName", profile.contactName);
    appendIfPresent("email", profile.email);
    appendIfPresent("companyName", profile.companyName);
    appendIfPresent("location", profile.location);
    appendIfPresent("industry", profile.industry);
    appendIfPresent("phoneNumber", profile.phoneNumber);
    appendIfPresent("countryCode", selectedCountry.code);
    if (profile.profilePhoto) {
      appendIfPresent("profilePhoto", profile.profilePhoto);
    }

    setIsSaving(true);
    try {
      await axiosInstance.put("/corporate/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000, // Add timeout
      });
      toast.success("Profile updated successfully");
      fetchProfile(true)
      navigate("/corporate-dashboard");
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [profile, selectedCountry, navigate, validateForm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" p-6 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Edit Corporate Profile
          </h2>

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full border-4 border-blue-100 bg-gray-100 overflow-hidden">
              {profile.profilePhoto || existingProfilePhoto ? (
                <img
                  src={
                    profile.profilePhoto
                      ? URL.createObjectURL(profile.profilePhoto)
                      : existingProfilePhoto
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  setProfile((prev) => ({
                    ...prev,
                    profilePhoto: e.target.files![0],
                  }))
                }
              />
            </div>
            <label
              htmlFor="profilePhoto"
              className="relative bottom-14 left-12 bg-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-5 h-5 text-blue-600" />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "contactName",
              "email",
              "companyName",
              "location",
              "industry",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field
                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                    .trim()}
                </label>
                <input
                  value={profile[field as keyof ProfileState]}
                  onChange={(e) =>
                    handleProfileChange(
                      field as keyof ProfileState,
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={`Enter ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()
                    .replace(/^./, (str) => str.toUpperCase())}`}
                />
                {errors[field] && (
                  <p className="mt-1.5 text-sm text-red-600">{errors[field]}</p>
                )}
              </div>
            ))}
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative mt-1">
                <div className="relative flex items-center border border-gray-300 rounded-lg bg-white h-[42px]">
                  <img
                    src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-8 h-5 ml-2"
                  />
                  <select
                    value={selectedCountry.isoCode}
                    onChange={handleCountryChange}
                    className="w-full pl-3 pr-6 bg-transparent outline-none appearance-none"
                  >
                    {countryData.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 text-gray-500" />
                </div>
              </div>
            </div>
            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <span className="px-3 py-2 border-r border-gray-300 bg-gray-50">
                  {selectedCountry.code}
                </span>
                <input
                  type="text"
                  value={profile.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={`${selectedCountry.maxLength} digits`}
                  className="w-full px-3 py-2 border-none focus:ring-0 rounded-r-lg"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={() => navigate("/corporate-dashboard")}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 text-white bg-primary rounded-lg hover:bg-secondary ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EditCorporateProfile;
