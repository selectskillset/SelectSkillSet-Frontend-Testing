import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import { countryData } from "../../components/common/countryData";
import { jobTitles } from "../../components/common/JobTitles";
import {
  XCircle,
  Camera,
  Pencil,
  ChevronDown,
  X,
  Plus,
  Euro,
} from "lucide-react";
import Loader from "../../components/ui/Loader";

type Experience = {
  company: string;
  position: string;
  employmentType: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
};

type ProfileState = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  phoneNumber: string;
  summary: string;
  price: string;
  skills: string[];
  profilePhoto: File | null;
  experiences: Experience[];
};

interface ExperienceEntryProps {
  exp: Experience;
  index: number;
  onChange: (index: number, field: keyof Experience, value: any) => void;
  onRemove: (index: number) => void;
  errors: { [key: string]: string };
}

const ExperienceEntry: React.FC<ExperienceEntryProps> = React.memo(
  ({ exp, index, onChange, onRemove, errors }) => {
    const handleChange =
      (field: keyof Experience) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        onChange(index, field, e.target.value);
      };

    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      const [day, month, year] = dateString.split("/");
      const fullYear = `20${year}`;
      return `${fullYear}-${month}-${day}`;
    };

    const parseDateInput = (dateString: string) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
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
      <div className="relative space-y-4 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remove entry"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter company name"
            />
            {errors[`experience-${index}-company`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-company`]}
              </p>
            )}
          </div>

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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter your position"
            />
            {errors[`experience-${index}-position`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-position`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={exp.location}
              onChange={handleChange("location")}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors[`experience-${index}-location`]
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter job location"
            />
            {errors[`experience-${index}-location`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-location`]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              value={exp.employmentType}
              onChange={handleChange("employmentType")}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors[`experience-${index}-employmentType`]
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="">Select Employment Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Temporary">Temporary</option>
            </select>
            {errors[`experience-${index}-employmentType`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-employmentType`]}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={exp.description}
              onChange={handleChange("description")}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="List your major duties and successes, highlighting specific projects"
              rows={4}
            />
          </div>

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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            {errors[`experience-${index}-startDate`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-startDate`]}
              </p>
            )}
          </div>

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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            {errors[`experience-${index}-endDate`] && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors[`experience-${index}-endDate`]}
              </p>
            )}
          </div>

          <div className="flex items-center md:col-span-2">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
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
      </div>
    );
  }
);

interface BasicInfoTabProps {
  profile: ProfileState;
  existingProfilePhoto: string;
  selectedCountry: (typeof countryData)[0];
  errors: { [key: string]: string };
  handleProfileChange: (field: keyof ProfileState, value: string) => void;
  handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleJobTitleInput: (value: string) => void;
  handleAddJobTitle: (title: string) => void;
  handleJobTitleKeyPress: (e: React.KeyboardEvent) => void;
  jobTitleInput: string;
  suggestedJobTitles: string[];
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = React.memo(
  ({
    profile,
    existingProfilePhoto,
    selectedCountry,
    errors,
    handleProfileChange,
    handleCountryChange,
    handlePhoneChange,
    handleJobTitleInput,
    handleAddJobTitle,
    handleJobTitleKeyPress,
    jobTitleInput,
    suggestedJobTitles,
    setProfile,
  }) => {
    return (
      <div className="space-y-6">
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
            className="relative bottom-14 left-12 bg-primary p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-secondary transition-colors"
          >
            <Pencil className="w-5 h-5 text-white" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              value={profile.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter First Name"
            />
            {errors.firstName && (
              <p className="mt-1.5 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              value={profile.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter Last Name"
            />
            {errors.lastName && (
              <p className="mt-1.5 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter or select job title"
            />
            {suggestedJobTitles.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {suggestedJobTitles.map((title) => (
                  <li
                    key={title}
                    onClick={() => handleAddJobTitle(title)}
                    className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer transition-colors text-gray-700"
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
              Location
            </label>
            <input
              value={profile.location}
              onChange={(e) => handleProfileChange("location", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Enter Location"
            />
            {errors.location && (
              <p className="mt-1.5 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This summary will be visible to candidates. Please provide a brief
              overview of your professional background and expertise.
            </p>
            <textarea
              value={profile.summary}
              onChange={(e) => handleProfileChange("summary", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.summary ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Write a brief summary about yourself that candidates will see"
              rows={4}
            />
            {errors.summary && (
              <p className="mt-1.5 text-sm text-red-600">{errors.summary}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Session (€)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Euro className="w-4 h-4" />
              </span>
              <input
                type="number"
                value={profile.price}
                onChange={(e) => handleProfileChange("price", e.target.value)}
                className={`w-full pl-8 px-4 py-2.5 rounded-lg border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Enter hourly rate"
                min="0"
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>
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
            <div className="flex items-center mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 py-2 border-r border-gray-300 bg-gray-50">
                {selectedCountry.code}
              </span>
              <input
                type="text"
                value={profile.phoneNumber}
                onChange={handlePhoneChange}
                placeholder={`${selectedCountry.maxLength} digits`}
                className={`w-full px-3 py-2 border-none focus:ring-0 rounded-r-lg ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

interface SkillsTabProps {
  profile: ProfileState;
  errors: { [key: string]: string };
  skillInput: string;
  suggestedSkills: string[];
  handleSkillInput: (value: string) => void;
  handleAddSkill: (skill: string) => void;
  handleSkillKeyPress: (e: React.KeyboardEvent) => void;
  handleRemoveSkill: (skill: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = React.memo(
  ({
    profile,
    errors,
    skillInput,
    suggestedSkills,
    handleSkillInput,
    handleAddSkill,
    handleSkillKeyPress,
    handleRemoveSkill,
  }) => {
    return (
      <div className="space-y-6">
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
              } focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Type and press enter to add skills"
            />
            {suggestedSkills.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {suggestedSkills.map((skill) => (
                  <li
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer transition-colors text-gray-700"
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
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {skill}
                <XCircle
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 w-4 h-4 cursor-pointer hover:text-primaryDark"
                />
              </span>
            ))}
          </div>
          {errors.skills && (
            <p className="mt-1.5 text-sm text-red-600">{errors.skills}</p>
          )}
        </div>
      </div>
    );
  }
);

interface ExperienceTabProps {
  profile: ProfileState;
  errors: { [key: string]: string };
  handleExperienceChange: (
    index: number,
    field: keyof Experience,
    value: any
  ) => void;
  addNewExperience: () => void;
  removeExperience: (index: number) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = React.memo(
  ({
    profile,
    errors,
    handleExperienceChange,
    addNewExperience,
    removeExperience,
  }) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <button
            onClick={addNewExperience}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {profile.experiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No experience added yet</p>
            </div>
          ) : (
            profile.experiences.map((exp, index) => (
              <ExperienceEntry
                key={index}
                exp={exp}
                index={index}
                onChange={handleExperienceChange}
                onRemove={removeExperience}
                errors={errors}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

const EditInterviewerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [profile, setProfile] = useState<ProfileState>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    phoneNumber: "",
    summary: "",
    price: "",
    skills: [],
    profilePhoto: null,
    experiences: [],
  });
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
        const { data } = await axiosInstance.get("/interviewer/getProfile");
        const profileData = data.profile;

        const country =
          countryData.find((c) => c.code === profileData.countryCode) ||
          countryData[0];

        setSelectedCountry(country);
        setProfile({
          ...profileData,
          phoneNumber: profileData.phoneNumber,
          profilePhoto: null,
          experiences: profileData.experiences || [],
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
          location: "",
          employmentType: "",
          description: "",
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
    if (!profile.summary.trim()) newErrors.summary = "Summary is required";
    if (!profile.price.trim()) newErrors.price = "Price is required";
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
      if (!exp.location.trim())
        newErrors[`experience-${index}-location`] = "Location is required";
      if (!exp.employmentType.trim())
        newErrors[`experience-${index}-employmentType`] =
          "Employment Type is required";
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
      phoneNumber: profile.phoneNumber,
      countryCode: selectedCountry.code,
      summary: profile.summary,
      price: profile.price,
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

    setIsSaving(true);
    try {
      await axiosInstance.put("/interviewer/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully");
      navigate("/interviewer-dashboard");
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Edit Interviewer Profile
          </h2>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "skills", label: "Skills" },
              { id: "experience", label: "Experience" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-primary" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "basic" && (
                  <BasicInfoTab
                    profile={profile}
                    existingProfilePhoto={existingProfilePhoto}
                    selectedCountry={selectedCountry}
                    errors={errors}
                    handleProfileChange={handleProfileChange}
                    handleCountryChange={handleCountryChange}
                    handlePhoneChange={handlePhoneChange}
                    handleJobTitleInput={handleJobTitleInput}
                    handleAddJobTitle={handleAddJobTitle}
                    handleJobTitleKeyPress={handleJobTitleKeyPress}
                    jobTitleInput={jobTitleInput}
                    suggestedJobTitles={suggestedJobTitles}
                    setProfile={setProfile}
                  />
                )}
                {activeTab === "skills" && (
                  <SkillsTab
                    profile={profile}
                    errors={errors}
                    skillInput={skillInput}
                    suggestedSkills={suggestedSkills}
                    handleSkillInput={handleSkillInput}
                    handleAddSkill={handleAddSkill}
                    handleSkillKeyPress={handleSkillKeyPress}
                    handleRemoveSkill={handleRemoveSkill}
                  />
                )}
                {activeTab === "experience" && (
                  <ExperienceTab
                    profile={profile}
                    errors={errors}
                    handleExperienceChange={handleExperienceChange}
                    addNewExperience={addNewExperience}
                    removeExperience={removeExperience}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => navigate("/interviewer-dashboard")}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 text-white bg-primary rounded-lg hover:bg-primaryDark transition-colors ${
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
export default EditInterviewerProfile;
