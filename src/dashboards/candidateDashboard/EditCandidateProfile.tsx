import React, { useState, useEffect, useCallback } from "react";
import {
  XCircle,
  Camera,
  UploadCloud,
  Pencil,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import { jobTitles } from "../../components/common/JobTitles";
import { countryData } from "../../components/common/countryData";
import { useNavigate } from "react-router-dom";

type Experience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
};

type ProfileState = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  linkedIn: string;
  phoneNumber: string;
  skills: string[];
  resume: File | null;
  profilePhoto: File | null;
  experiences: Experience[];
};

// interface Experience {
//   company: string;
//   position: string;
//   startDate: string;
//   endDate?: string;
//   current: boolean;
// }

interface ExperienceEntryProps {
  exp: Experience;
  index: number;
  onChange: (index: number, field: keyof Experience, value: any) => void;
  onRemove: (index: number) => void;
  errors: { [key: string]: string };
}

const ExperienceEntry: React.FC<ExperienceEntryProps> = ({
  exp,
  index,
  onChange,
  onRemove,
  errors,
}) => {
  const handleChange =
    (field: keyof Experience) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(index, field, e.target.value);
    };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    // Convert from dd/mm/yy to Date object
    const [day, month, year] = dateString.split("/");
    const fullYear = `20${year}`; // Assuming 21st century dates
    return `${fullYear}-${month}-${day}`;
  };

  const parseDateInput = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Convert to dd/mm/yy format
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "";
    }
  };

  const handleDateChange =
    (field: "startDate" | "endDate") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedDate = parseDateInput(e.target.value);
      onChange(index, field, formattedDate);
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, "current", e.target.checked);
    if (e.target.checked) {
      onChange(index, "endDate", "");
    }
  };

  return (
    <div className="relative space-y-4 p-4 border rounded-lg bg-gray-50">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Remove entry"
      >
        <X />
      </button>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={exp.company}
          onChange={handleChange("company")}
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors[`experience-${index}-company`]
              ? "border-red-500"
              : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Enter company name"
        />
        {errors[`experience-${index}-company`] && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors[`experience-${index}-company`]}
          </p>
        )}
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position
        </label>
        <input
          type="text"
          value={exp.position}
          onChange={handleChange("position")}
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors[`experience-${index}-position`]
              ? "border-red-500"
              : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Enter your position"
        />
        {errors[`experience-${index}-position`] && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors[`experience-${index}-position`]}
          </p>
        )}
      </div>

      {/* Start Date and End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formatDateForInput(exp.startDate)}
            onChange={handleDateChange("startDate")}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors[`experience-${index}-startDate`]
                ? "border-red-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors[`experience-${index}-startDate`] && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors[`experience-${index}-startDate`]}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formatDateForInput(exp.endDate)}
            onChange={handleDateChange("endDate")}
            disabled={exp.current}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors[`experience-${index}-endDate`]
                ? "border-red-500"
                : exp.current
                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors[`experience-${index}-endDate`] && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors[`experience-${index}-endDate`]}
            </p>
          )}
        </div>
      </div>

      {/* Current Employment Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={exp.current}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          id={`current-${index}`}
        />
        <label
          htmlFor={`current-${index}`}
          className="ml-2 text-sm text-gray-700"
        >
          I currently work here
        </label>
      </div>
    </div>
  );
};

const EditCandidateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    linkedIn: "",
    phoneNumber: "",
    skills: [],
    resume: null,
    profilePhoto: null,
    experiences: [],
  });
  const [existingResume, setExistingResume] = useState("");
  const [existingProfilePhoto, setExistingProfilePhoto] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestedJobTitles, setSuggestedJobTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/candidate/getProfile");
        const profileData = data.profile;

        const country =
          countryData.find((c) => c.code === profileData.countryCode) ||
          countryData[0];

        setSelectedCountry(country);

        setProfile({
          ...profileData,
          phoneNumber: profileData.phoneNumber,
          resume: null,
          profilePhoto: null,
          experiences: profileData.experiences || [],
        });
        setExistingResume(profileData.resume);
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

  const handleExperienceChange = useCallback(
    (index: number, field: keyof Experience, value: any) => {
      setProfile((prev) => {
        const updated = [...prev.experiences];
        updated[index] = { ...updated[index], [field]: value };
        if (field === "current" && value) updated[index].endDate = null;
        return { ...prev, experiences: updated };
      });
    },
    []
  );

  const addNewExperience = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: null,
          current: false,
        },
      ],
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!profile.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!profile.skills.length)
      newErrors.skills = "At least one skill is required";
    if (!profile.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (profile.phoneNumber.length !== selectedCountry.maxLength) {
      newErrors.phoneNumber = `Phone number must be ${selectedCountry.maxLength} digits`;
    }

    profile.experiences.forEach((exp, index) => {
      if (!exp.company.trim())
        newErrors[`experience-${index}-company`] = "Company name is required";
      if (!exp.position.trim())
        newErrors[`experience-${index}-position`] = "Position is required";
      if (!exp.startDate)
        newErrors[`experience-${index}-startDate`] = "Start date is required";
      if (!exp.current && !exp.endDate)
        newErrors[`experience-${index}-endDate`] = "End date is required";
    });

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }, [profile, selectedCountry]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      jobTitle: profile.jobTitle,
      location: profile.location,
      linkedIn: profile.linkedIn,
      phoneNumber: profile.phoneNumber,
      countryCode: selectedCountry.code,
      skills: profile.skills,
      experiences: profile.experiences.map((exp) => ({
        ...exp,
        endDate: exp.current ? null : exp.endDate,
      })),
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(
        key,
        key === "skills" || key === "experiences"
          ? JSON.stringify(value)
          : value
      );
    });

    if (profile.profilePhoto)
      formData.append("profilePhoto", profile.profilePhoto);
    if (profile.resume) formData.append("resume", profile.resume);

    setIsSaving(true);
    try {
      await axiosInstance.put("/candidate/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully");
      navigate("/candidate-dashboard");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }, [profile, selectedCountry, navigate, validateForm]);

  const handleSkillInput = useCallback(
    (value: string) => {
      setSkillInput(value);
      setSuggestedSkills(
        skillsData
          .filter(
            (skill) =>
              skill.toLowerCase().includes(value.toLowerCase()) &&
              !profile.skills.includes(skill)
          )
          .slice(0, 5)
      );
    },
    [profile.skills]
  );

  const handleAddSkill = useCallback(
    (skill: string) => {
      if (!skill.trim()) return;
      if (!profile.skills.includes(skill)) {
        setProfile((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
        setSkillInput("");
        setSuggestedSkills([]);
      }
    },
    [profile.skills]
  );

  const handleSkillKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && skillInput.trim()) {
        e.preventDefault();
        handleAddSkill(skillInput.trim());
      }
    },
    [skillInput, handleAddSkill]
  );

  const handleJobTitleInput = useCallback((value: string) => {
    setJobTitleInput(value);
    setSuggestedJobTitles(
      jobTitles
        .filter((title) => title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
    );
  }, []);

  const handleAddJobTitle = useCallback((title: string) => {
    if (title.trim()) {
      setProfile((prev) => ({ ...prev, jobTitle: title }));
      setJobTitleInput("");
      setSuggestedJobTitles([]);
    }
  }, []);

  const handleJobTitleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && jobTitleInput.trim()) {
        e.preventDefault();
        handleAddJobTitle(jobTitleInput.trim());
      }
    },
    [jobTitleInput, handleAddJobTitle]
  );

  const handleRemoveSkill = useCallback((skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  const formatLabel = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Edit Profile
        </h2>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["firstName", "lastName", "location", "linkedIn"] as const).map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formatLabel(field)}
                </label>
                <input
                  value={profile[field]}
                  onChange={(e) => handleProfileChange(field, e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={`Enter ${formatLabel(field)}`}
                />
                {errors[field] && (
                  <p className="mt-1.5 text-sm text-red-600">{errors[field]}</p>
                )}
              </div>
            )
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              value={jobTitleInput || profile.jobTitle}
              onChange={(e) => {
                handleJobTitleInput(e.target.value);
                handleProfileChange("jobTitle", e.target.value);
              }}
              onKeyPress={handleJobTitleKeyPress}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.jobTitle ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter or select job title"
            />
            {suggestedJobTitles.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {suggestedJobTitles.map((title) => (
                  <li
                    key={title}
                    onClick={() => handleAddJobTitle(title)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700"
                  >
                    {title}
                  </li>
                ))}
              </ul>
            )}
            {errors.jobTitle && (
              <p className="mt-1.5 text-sm text-red-600">{errors.jobTitle}</p>
            )}
          </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="relative">
            <input
              value={skillInput}
              onChange={(e) => handleSkillInput(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.skills ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Type and press enter to add skills"
            />
            {suggestedSkills.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {suggestedSkills.map((skill) => (
                  <li
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
                <XCircle
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 w-4 h-4 cursor-pointer hover:text-blue-900"
                />
              </span>
            ))}
          </div>
          {errors.skills && (
            <p className="mt-1.5 text-sm text-red-600">{errors.skills}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
            <button
              onClick={addNewExperience}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {profile.experiences.map((exp, index) => (
              <ExperienceEntry
                key={index}
                exp={exp}
                index={index}
                onChange={handleExperienceChange}
                onRemove={removeExperience}
                errors={errors}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          <label
            htmlFor="resume"
            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-500">
              {profile.resume ? profile.resume.name : "Upload resume (PDF/DOC)"}
            </span>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] &&
                setProfile((prev) => ({
                  ...prev,
                  resume: e.target.files![0],
                }))
              }
            />
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate("/candidate-dashboard")}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ${
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
