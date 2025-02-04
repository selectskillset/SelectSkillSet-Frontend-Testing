import { useState, useEffect, useCallback } from "react";
import { XCircle, Camera, UploadCloud, Pen } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import { countryData } from "../../components/common/countryData"; // Ensure countryData is imported
import Loader from "../../components/ui/Loader"; // Ensure Loader is implemented
import { useNavigate } from "react-router-dom";

const EditCandidateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    linkedIn: "",
    mobile: "",
    countryCode: "+91", // Default country code
    skills: [] as string[],
    resume: null as File | null,
    profilePhoto: null as File | null,
  });
  const [existingResume, setExistingResume] = useState("");
  const [existingProfilePhoto, setExistingProfilePhoto] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/candidate/getProfile");
        const {
          firstName = "",
          lastName = "",
          jobTitle = "",
          location = "",
          linkedIn = "",
          mobile = "",
          countryCode = "+91",
          skills = [],
          resume = "",
          profilePhoto = "",
        } = data.profile;
        setProfile({
          firstName,
          lastName,
          jobTitle,
          location,
          linkedIn,
          mobile,
          countryCode,
          skills,
          resume: null,
          profilePhoto: null,
        });
        setExistingResume(resume);
        setExistingProfilePhoto(profilePhoto);
      } catch (error) {
        toast.error("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle field changes
  const handleProfileChange = useCallback((key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }, []);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.firstName) newErrors.firstName = "First name is required.";
    if (!profile.lastName) newErrors.lastName = "Last name is required.";
    if (!profile.mobile) newErrors.mobile = "Mobile number is required.";
    if (profile.skills.length === 0)
      newErrors.skills = "At least one skill is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile.firstName, profile.lastName, profile.mobile, profile.skills]);

  // Save changes
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    // Append fields to FormData
    Object.entries(profile).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append(key, JSON.stringify(value)); // Handle skills as JSON
      } else if ((key === "resume" || key === "profilePhoto") && value) {
        formData.append(key, value); // Append new files if they exist
      } else if (key === "profilePhoto" && !value && existingProfilePhoto) {
        // Preserve the existing profile photo if no new photo is uploaded
        formData.append(key, existingProfilePhoto);
      } else if (key === "resume" && !value && existingResume) {
        // Preserve the existing resume if no new resume is uploaded
        formData.append(key, existingResume);
      } else {
        formData.append(key, value);
      }
    });

    setIsSaving(true);
    try {
      await axiosInstance.put("/candidate/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      navigate("/candidate-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [profile, existingProfilePhoto, existingResume, navigate, validateForm]);

  // Handle resume upload
  const handleResumeUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfile((prev) => ({ ...prev, resume: file }));
        toast.success("Resume uploaded successfully!");
      }
    },
    []
  );

  // Handle profile photo upload
  const handleProfilePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfile((prev) => ({ ...prev, profilePhoto: file }));
        toast.success("Profile photo uploaded successfully!");
      }
    },
    []
  );

  // Handle skills input
  const handleSkillInput = useCallback(
    (value: string) => {
      setSkillInput(value);
      setSuggestedSkills(
        skillsData.filter(
          (skill) =>
            skill.toLowerCase().includes(value.toLowerCase()) &&
            !profile.skills.includes(skill)
        )
      );
    },
    [profile.skills]
  );

  const handleAddSkill = useCallback(
    (skill: string) => {
      if (skill.length > 20) {
        toast.error("Skill name should be less than 20 characters.");
        return;
      }
      const updatedSkills = [...profile.skills, skill];
      setProfile((prev) => ({ ...prev, skills: updatedSkills }));
      setSkillInput("");
      setSuggestedSkills([]);
      setErrors((prev) => ({ ...prev, skills: "" }));
    },
    [profile.skills]
  );

  const handleRemoveSkill = useCallback(
    (skill: string) => {
      const updatedSkills = profile.skills.filter((s) => s !== skill);
      setProfile((prev) => ({ ...prev, skills: updatedSkills }));
    },
    [profile.skills]
  );

  if (isLoading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="profilePhoto"
            className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer hover:bg-gray-300 transition border-4 border-[#0077B5]"
          >
            {profile.profilePhoto ? (
              <img
                src={URL.createObjectURL(profile.profilePhoto)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : existingProfilePhoto ? (
              <img
                src={existingProfilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 w-12 h-12" />
            )}
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePhotoUpload}
          />
          <p className="mt-2 text-sm text-gray-600">Upload Profile Photo</p>
        </div>

        {/* Form Fields */}
        {["firstName", "lastName", "jobTitle", "location", "linkedIn"].map(
          (key) => (
            <div key={key} className="mb-4">
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700"
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                id={key}
                type="text"
                value={profile[key as keyof typeof profile]}
                onChange={(e) => handleProfileChange(key, e.target.value)}
                className={`mt-1 block w-full px-4 py-3 border ${
                  errors[key] ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-[#0077B5] focus:border-[#0077B5]`}
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
              />
              {errors[key] && (
                <p className="mt-1 text-sm text-red-500">{errors[key]}</p>
              )}
            </div>
          )
        )}

        {/* Mobile Number and Country Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <select
              value={profile.countryCode}
              onChange={(e) =>
                handleProfileChange("countryCode", e.target.value)
              }
              className="mt-1 block w-1/4 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0077B5] focus:border-[#0077B5]"
            >
              {countryData.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} ({country.isoCode})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={profile.mobile}
              onChange={(e) => handleProfileChange("mobile", e.target.value)}
              className={`mt-1 block w-3/4 px-4 py-3 border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-[#0077B5] focus:border-[#0077B5]`}
              placeholder="Enter mobile number"
            />
          </div>
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Skills
          </label>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => handleSkillInput(e.target.value)}
            className={`mt-1 block w-full px-4 py-3 border ${
              errors.skills ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#0077B5] focus:border-[#0077B5]`}
            placeholder="Start typing to add skills..."
          />
          {suggestedSkills.length > 0 && (
            <ul className="mt-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md">
              {suggestedSkills.map((skill) => (
                <li
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {skill}
                <XCircle
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 w-4 h-4 cursor-pointer text-blue-700"
                />
              </span>
            ))}
          </div>
          {errors.skills && (
            <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
          )}
        </div>

        {/* Resume Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Resume
          </label>
          <label
            htmlFor="resume"
            className="mt-1 flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#0077B5] transition"
          >
            <UploadCloud className="w-6 h-6 text-gray-500 mr-2" />
            <span className="text-gray-600">
              {profile.resume
                ? profile.resume.name
                : "Click to upload or drag and drop"}
            </span>
          </label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
          {existingResume && !profile.resume && (
            <p className="mt-2 text-sm text-gray-600">
              Current Resume:{" "}
              <a
                href={existingResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077B5] hover:underline"
              >
                View
              </a>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/candidate-dashboard")}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 bg-[#0077B5] text-white rounded-md hover:bg-[#005885] transition ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditCandidateProfile;
