import React, { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, X, Star, User, UploadCloud, Plus } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import { useNavigate } from "react-router-dom";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  resume?: string;
  skills: string[];
  profilePhoto?: string;
  statistics: {
    averageRating: number;
  };
  linkedIn?: string;
}

const FilterCandidates: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    skillsRequired: [] as string[],
    description: "",
    jobDescriptionFile: null as File | null,
  });
  const [inputSkill, setInputSkill] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

  const suggestedSkills = useMemo(
    () =>
      skillsData
        .filter(
          (skill) =>
            skill.toLowerCase().includes(inputSkill.toLowerCase()) &&
            !formData.skillsRequired.includes(skill)
        )
        .slice(0, 5),
    [inputSkill, formData.skillsRequired]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "skillsRequired") {
        setInputSkill(value);
        setIsSkillsDropdownOpen(value.length > 0);
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleAddSkill = useCallback(
    (skill: string) => {
      if (!skill.trim()) return;
      const formattedSkill = skill.trim().toLowerCase();
      if (
        !formData.skillsRequired.some((s) => s.toLowerCase() === formattedSkill)
      ) {
        setFormData((prev) => ({
          ...prev,
          skillsRequired: [...prev.skillsRequired, skill.trim()],
        }));
      }
      setInputSkill("");
      setIsSkillsDropdownOpen(false);
    },
    [formData.skillsRequired]
  );

  const handleRemoveSkill = useCallback((skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && inputSkill.trim()) {
        handleAddSkill(inputSkill);
      }
    },
    [inputSkill, handleAddSkill]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      file && setFormData((prev) => ({ ...prev, jobDescriptionFile: file }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const hasCriteria = Object.values(formData).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
    if (!hasCriteria) {
      toast.error("Please provide at least one filter criteria");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "skillsRequired") {
          value.forEach((skill) => form.append("skillsRequired[]", skill));
        } else if (value) {
          form.append(key, value);
        }
      });

      const { data } = await axiosInstance.post(
        "/corporate/candidates/filter",
        form
      );
      setFilteredCandidates(data.candidates || []);
      toast.success(
        `Found ${data.candidates?.length || 0} matching candidates`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to filter candidates"
      );
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);

  const renderStars = useCallback((rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < fullStars || (i === fullStars && hasHalfStar)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">
            Filter Candidates
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="relative flex gap-2">
                <input
                  name="skillsRequired"
                  value={inputSkill}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Search or add skills..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() =>
                    inputSkill.trim() && handleAddSkill(inputSkill)
                  }
                  disabled={!inputSkill.trim()}
                  className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add skill"
                >
                  <Plus size={18} />
                </button>
              </div>

              {isSkillsDropdownOpen && suggestedSkills.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  {suggestedSkills.map((skill) => (
                    <li
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center pl-3 pr-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5 text-primary/70 hover:text-primary"
                      aria-label={`Remove ${skill} skill`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter job description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Job Description
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="flex-1 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center transition-colors group-hover:border-primary">
                  <UploadCloud className="w-6 h-6 text-gray-400 mb-2 group-hover:text-primary" />
                  {formData.jobDescriptionFile ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-gray-700 text-sm ">
                        {formData.jobDescriptionFile.name}
                      </span>
                      {formData.jobDescriptionFile && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              jobDescriptionFile: null,
                            }))
                          }
                          className="p-2 text-gray-500 hover:text-gray-700"
                          aria-label="Remove file"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Click to upload</p>
                      <p className="text-gray-400 text-xs mt-1">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium flex items-center justify-center transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Filtering...
                </>
              ) : (
                "Filter Candidates"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 p-4 bg-white rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Matching Candidates
            </h2>
            <span className="text-sm text-gray-500">
              {filteredCandidates.length} results
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-primary text-2xl" />
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Profile", "Name", "Skills", "Location", "Rating"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate._id}
                      onClick={() =>
                        navigate(`/candidateProfile/${candidate._id}`)
                      }
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={candidate.profilePhoto || "/default-profile.png"}
                          alt={`${candidate.firstName} ${candidate.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.src = "/default-profile.png")
                          }
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {candidate.location || "Remote"}
                      </td>
                      <td className="px-4 py-3">
                        {renderStars(candidate.statistics.averageRating)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No candidates found
              </h3>
              <p className="text-gray-500">
                Adjust your filters or try different search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCandidates;
