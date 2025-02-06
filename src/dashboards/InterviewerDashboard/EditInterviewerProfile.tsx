import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { countryData } from "../../components/common/countryData";
import { skillsData } from "../../components/common/SkillsData";

const EditInterviewerProfile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("interviewerToken");

  const allowedUpdates = [
    "firstName",
    "lastName",
    "jobTitle",
    "location",
    "phoneNumber",
    "profilePhoto",
    "experience",
    "price",
    "countryCode",
    "skills",
  ];

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    phoneNumber: "",
    profilePhoto: "",
    experience: "",
    price: "",
    countryCode: "",
    skills: [],
  });

  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/interviewer/getProfile");
        const profileData = response.data?.profile || {};

        setProfile({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          jobTitle: profileData.jobTitle || "",
          location: profileData.location || "",
          phoneNumber: profileData.phoneNumber || "",
          profilePhoto: profileData.profilePhoto || "",
          experience: profileData.experience,
          price: profileData.price,
          countryCode: profileData.countryCode || countryData[0].code,
          skills: profileData.skills || [],
        });

        setSelectedCountry(
          countryData.find((item) => item.code === profileData.countryCode) ||
            countryData[0]
        );
      } catch (error) {
        toast.error("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
  }, [token]);

  const handleSkillChange = (e) => {
    const input = e.target.value;
    setSkillInput(input);
    if (input) {
      setSuggestedSkills(
        skillsData
          .filter((skill) => skill.toLowerCase().includes(input.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      setSuggestedSkills([]);
    }
  };

  const handleAddSkill = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
    setSkillInput("");
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const handleSave = async () => {
    const phoneNumberRegex = /^[0-9]{10,15}$/;

    if (
      !profile.firstName ||
      !profile.lastName ||
      !profile.phoneNumber ||
      !profile.experience ||
      !profile.price
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!phoneNumberRegex.test(profile.phoneNumber)) {
      toast.error("Invalid phoneNumber number.");
      return;
    }

    try {
      const updatedData = Object.fromEntries(
        Object.entries(profile).filter(([key]) => allowedUpdates.includes(key))
      );

      updatedData.countryCode = selectedCountry.code;

      const response = await axiosInstance.put(
        "/interviewer/updateProfile",
        updatedData
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        navigate("/interviewer-dashboard");
      } else {
        toast.error(
          response.data.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10"
    >
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Interviewer Profile
        </h2>

        {/* First Name */}
        <div className="mb-6">
          <label className="font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
            className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label className="font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
            className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your last name"
          />
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <label className="font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            value={profile.jobTitle}
            onChange={(e) =>
              setProfile({ ...profile, jobTitle: e.target.value })
            }
            className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your job title"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
            className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your location"
          />
        </div>

        {/* phoneNumber Number with Country Code */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-1/4">
            <label className="font-medium text-gray-700">Country Code</label>
            <input
              type="text"
              value={selectedCountry.code}
              readOnly
              className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>
          <div className="w-3/4">
            <label className="font-medium text-gray-700">phoneNumber Number</label>
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              maxLength={selectedCountry.maxLength}
              placeholder="Enter your phoneNumber number"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6 relative">
          <label className="font-medium text-gray-700">Experience</label>
          <input
            type="text"
            value={profile.experience}
            onChange={(e) =>
              setProfile({ ...profile, experience: e.target.value })
            }
            className="text-gray-800 p-4 pl-10 pr-16 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your experience in years"
          />
          <span className="absolute right-3 bottom-4 text-xl">years</span>
        </div>

        {/* Price */}
        <div className="mb-6 relative">
          <label className="font-medium text-gray-700">Price</label>
          <input
            type="text"
            value={profile.price}
            onChange={(e) =>
              setProfile({ ...profile, price: e.target.value })
            }
            className="text-gray-800 p-4 pl-10 pr-16 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Enter your price"
          />
          <span className="absolute right-3 bottom-3 text-2xl">$</span>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="font-medium text-gray-700">Skills</label>
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillChange}
            className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            placeholder="Type to search and add skills"
          />
          {suggestedSkills.length > 0 && (
            <div className="border border-gray-300 rounded-lg mt-2 bg-white shadow-md">
              {suggestedSkills.map((skill, index) => (
                <div
                  key={index}
                  onClick={() => handleAddSkill(skill)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => navigate("/interviewer-dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditInterviewerProfile;
