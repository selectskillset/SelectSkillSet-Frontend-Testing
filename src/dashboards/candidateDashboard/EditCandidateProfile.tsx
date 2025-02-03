import { useState, useEffect, useMemo, useCallback } from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import Loader from "../../components/ui/Loader"; // Ensure Loader is implemented

const EditCandidateProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    linkedIn: "",
    skills: [] as string[],
    resume: null as File | null,
  });
  const [existingResume, setExistingResume] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API requests
  const [isSaving, setIsSaving] = useState(false); // Loading state while saving
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Error messages

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
          skills = [],
          resume = "",
        } = data.profile;

        setProfile({
          firstName,
          lastName,
          jobTitle,
          location,
          linkedIn,
          skills,
          resume: null,
        });
        setExistingResume(resume); // Store the existing resume name
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
    setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error on change
  }, []);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.firstName) newErrors.firstName = "First name is required.";
    if (!profile.lastName) newErrors.lastName = "Last name is required.";
    if (profile.skills.length === 0)
      newErrors.skills = "At least one skill is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile.firstName, profile.lastName, profile.skills]);

  // Save changes (only send updated fields)
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append(key, JSON.stringify(value)); // Handle skills as JSON
      } else if (key === "resume" && value) {
        formData.append(key, value); // Append resume if it exists
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
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [profile, navigate, validateForm]);

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
      setErrors((prev) => ({ ...prev, skills: "" })); // Clear skill error
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

  const memoizedSkills = useMemo(() => profile.skills, [profile.skills]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10"
    >
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-[#0077B5] mb-6 text-center">
          Edit Candidate Profile
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader /> {/* Loader component when loading profile data */}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form Fields */}
            {["firstName", "lastName", "jobTitle", "location", "linkedIn"].map(
              (key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={profile[key as keyof typeof profile]}
                    onChange={(e) => handleProfileChange(key, e.target.value)}
                    className={`text-gray-800 p-4 rounded-lg border ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    } w-full focus:outline-none focus:ring-2 focus:ring-[#0077B5]`}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                  />
                  {errors[key] && (
                    <p className="text-sm text-red-500">{errors[key]}</p>
                  )}
                </div>
              )
            )}

            {/* Skills Section */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Skills</label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => handleSkillInput(e.target.value)}
                className={`text-gray-800 p-4 rounded-lg border ${
                  errors.skills ? "border-red-500" : "border-gray-300"
                } w-full focus:outline-none focus:ring-2 focus:ring-[#0077B5]`}
                placeholder="Start typing to add skills..."
              />
              {suggestedSkills.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-lg mt-2 max-h-32 overflow-y-auto">
                  {suggestedSkills.map((skill) => (
                    <li
                      key={skill}
                      className="px-4 py-2 cursor-pointer hover:bg-[#0077B5]/10"
                      onClick={() => handleAddSkill(skill)}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {memoizedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#0077B5] text-white py-1 px-3 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <XCircle
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </span>
                ))}
              </div>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills}</p>
              )}
            </div>

            {/* Resume Section */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Upload Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
              />
              {profile.resume ? (
                <p className="text-sm text-green-600 mt-2">
                  {profile.resume.name} is uploaded.
                </p>
              ) : existingResume ? (
                <p className="text-sm text-gray-700 mt-2">
                  Current Resume: {existingResume}
                </p>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                className="w-full sm:w-auto bg-[#0077B5] text-white py-3 px-6 rounded-lg hover:bg-[#005885]"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader /> : "Save Changes"}
              </button>
              <button
                className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-400"
                onClick={() => navigate("/candidate-dashboard")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EditCandidateProfile;
