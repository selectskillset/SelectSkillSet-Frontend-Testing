import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";
import {
  Loader2,
  X,
  Star,
  User,
  Plus,
  ChevronRight,
  MapPin,
} from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import { useNavigate } from "react-router-dom";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
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
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("candidateFilterState");
    return saved
      ? JSON.parse(saved)
      : {
          title: "",
          skillsRequired: [] as string[],
          description: "",
        };
  });
  const [inputSkill, setInputSkill] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [matchStrength, setMatchStrength] = useState<"high" | "medium" | "low">("high");

  useEffect(() => {
    sessionStorage.setItem("candidateFilterState", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedCandidates = sessionStorage.getItem("filteredCandidates");
    if (savedCandidates) {
      setFilteredCandidates(JSON.parse(savedCandidates));
    }

    const savedMatchStrength = sessionStorage.getItem("matchStrength");
    if (savedMatchStrength) {
      setMatchStrength(savedMatchStrength as "high" | "medium" | "low");
    }
  }, []);

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
      const payload = {
        title: formData.title,
        skillsRequired: formData.skillsRequired,
        description: formData.description,
        matchStrength,
      };

      const { data } = await axiosInstance.post(
        "/corporate/candidates/filter",
        payload
      );
      setFilteredCandidates(data.candidates || []);
      sessionStorage.setItem(
        "filteredCandidates",
        JSON.stringify(data.candidates || [])
      );
      sessionStorage.setItem("matchStrength", matchStrength);
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
  }, [formData, validateForm, matchStrength]);

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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" data-tooltip-id="page-title-tooltip" data-tooltip-content="Find top talent for your company">
              Find Top Talent
            </h1>
            <Tooltip id="page-title-tooltip" />
            <p className="text-gray-600" data-tooltip-id="page-description-tooltip" data-tooltip-content="Use filters to find the best candidates">
              Filter candidates based on job requirements and skills
            </p>
            <Tooltip id="page-description-tooltip" />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2" data-tooltip-id="job-title-label-tooltip" data-tooltip-content="Enter the job title">
                Job Title
              </label>
              <Tooltip id="job-title-label-tooltip" />
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-tooltip-id="job-title-input-tooltip"
                data-tooltip-content="Type the job title here"
              />
              <Tooltip id="job-title-input-tooltip" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-2" data-tooltip-id="skills-label-tooltip" data-tooltip-content="Add required skills for the job">
                Required Skills
              </label>
              <Tooltip id="skills-label-tooltip" />
              <div className="relative flex gap-2">
                <input
                  name="skillsRequired"
                  value={inputSkill}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Search or add skills..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-tooltip-id="skills-input-tooltip"
                  data-tooltip-content="Search for skills and add them"
                />
                <Tooltip id="skills-input-tooltip" />
                <button
                  onClick={() => inputSkill.trim() && handleAddSkill(inputSkill)}
                  disabled={!inputSkill.trim()}
                  className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add skill"
                  data-tooltip-id="add-skill-button-tooltip"
                  data-tooltip-content="Click to add the skill"
                >
                  <Plus size={18} />
                </button>
                <Tooltip id="add-skill-button-tooltip" />
              </div>

              {isSkillsDropdownOpen && suggestedSkills.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  {suggestedSkills.map((skill) => (
                    <li
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                      data-tooltip-id="suggested-skill-tooltip"
                      data-tooltip-content={`Click to add ${skill}`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
              <Tooltip id="suggested-skill-tooltip" />

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center pl-3 pr-2 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    data-tooltip-id="skill-tag-tooltip"
                    data-tooltip-content={`Skill: ${skill}`}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1.5 text-primary/70 hover:text-primary"
                      aria-label={`Remove ${skill} skill`}
                      data-tooltip-id="remove-skill-button-tooltip"
                      data-tooltip-content="Click to remove this skill"
                    >
                      <X size={14} />
                    </button>
                    <Tooltip id="remove-skill-button-tooltip" />
                  </span>
                ))}
              </div>
              <Tooltip id="skill-tag-tooltip" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2" data-tooltip-id="job-description-label-tooltip" data-tooltip-content="Describe the job role">
                Job Description
              </label>
              <Tooltip id="job-description-label-tooltip" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                data-tooltip-id="job-description-input-tooltip"
                data-tooltip-content="Enter the job description here"
              />
              <Tooltip id="job-description-input-tooltip" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2" data-tooltip-id="match-precision-label-tooltip" data-tooltip-content="Select the match precision">
                Match Precision
              </label>
              <Tooltip id="match-precision-label-tooltip" />
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMatchStrength("high")}
                  className={`py-3 rounded-lg text-sm font-medium flex items-center justify-center ${
                    matchStrength === "high"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  data-tooltip-id="high-precision-button-tooltip"
                  data-tooltip-content="High precision: matches all criteria"
                >
                  High
                </button>
                <Tooltip id="high-precision-button-tooltip" />
                <button
                  type="button"
                  onClick={() => setMatchStrength("medium")}
                  className={`py-3 rounded-lg text-sm font-medium flex items-center justify-center ${
                    matchStrength === "medium"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  data-tooltip-id="medium-precision-button-tooltip"
                  data-tooltip-content="Medium precision: matches most criteria"
                >
                  Medium
                </button>
                <Tooltip id="medium-precision-button-tooltip" />
                <button
                  type="button"
                  onClick={() => setMatchStrength("low")}
                  className={`py-3 rounded-lg text-sm font-medium flex items-center justify-center ${
                    matchStrength === "low"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  data-tooltip-id="low-precision-button-tooltip"
                  data-tooltip-content="Low precision: matches any criteria"
                >
                  Low
                </button>
                <Tooltip id="low-precision-button-tooltip" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {matchStrength === "high" && "Show only candidates matching all criteria"}
                {matchStrength === "medium" && "Show candidates matching most criteria"}
                {matchStrength === "low" && "Show candidates matching any criteria"}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium flex items-center justify-center transition-all disabled:opacity-70 shadow-md hover:shadow-lg"
              data-tooltip-id="submit-button-tooltip"
              data-tooltip-content="Click to search for candidates"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Searching Candidates...
                </>
              ) : (
                "Find Candidates"
              )}
            </button>
            <Tooltip id="submit-button-tooltip" />
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-tooltip-id="matching-candidates-title-tooltip" data-tooltip-content="List of candidates matching your criteria">
                Matching Candidates
              </h2>
              <Tooltip id="matching-candidates-title-tooltip" />
              <p className="text-gray-600 text-sm mt-1" data-tooltip-id="matching-candidates-description-tooltip" data-tooltip-content="Browse through the candidates">
                Professionals matching your criteria
              </p>
              <Tooltip id="matching-candidates-description-tooltip" />
            </div>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium" data-tooltip-id="results-count-tooltip" data-tooltip-content="Number of candidates found">
              {filteredCandidates.length} results
            </span>
            <Tooltip id="results-count-tooltip" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary text-4xl mb-4" />
              <p className="text-gray-600" data-tooltip-id="loading-tooltip" data-tooltip-content="Loading candidates">
                Searching for matching candidates...
              </p>
              <Tooltip id="loading-tooltip" />
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 gap-5 p-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    onClick={() => navigate(`/candidateProfile/${candidate._id}`)}
                    className="p-5 bg-white border border-gray-200 rounded-xl hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
                    data-tooltip-id="candidate-card-tooltip"
                    data-tooltip-content={`View details of ${candidate.firstName} ${candidate.lastName}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={candidate.profilePhoto || "/default-profile.png"}
                          alt={`${candidate.firstName} ${candidate.lastName}`}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow"
                          onError={(e) => (e.currentTarget.src = "/default-profile.png")}
                          data-tooltip-id="candidate-image-tooltip"
                          data-tooltip-content="Candidate profile image"
                        />
                        <Tooltip id="candidate-image-tooltip" />
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full" data-tooltip-id="match-percentage-tooltip" data-tooltip-content="Match percentage">
                          {Math.floor(Math.random() * 40 + 60)}%
                        </div>
                        <Tooltip id="match-percentage-tooltip" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900" data-tooltip-id="candidate-name-tooltip" data-tooltip-content="Candidate's name">
                              {candidate.firstName} {candidate.lastName}
                            </h3>
                            <Tooltip id="candidate-name-tooltip" />
                            <p className="text-gray-700 text-sm" data-tooltip-id="candidate-job-title-tooltip" data-tooltip-content="Candidate's job title">
                              {candidate.jobTitle}
                            </p>
                            <Tooltip id="candidate-job-title-tooltip" />
                          </div>
                          <div className="flex items-center gap-1" data-tooltip-id="candidate-rating-tooltip" data-tooltip-content="Candidate's rating">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {candidate.statistics.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <Tooltip id="candidate-rating-tooltip" />
                        </div>

                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 4).map((skill) => (
                              <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium" data-tooltip-id="candidate-skill-tooltip" data-tooltip-content={`Skill: ${skill}`}>
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 4 && (
                              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs" data-tooltip-id="additional-skills-tooltip" data-tooltip-content="Additional skills">
                                +{candidate.skills.length - 4}
                              </span>
                            )}
                          </div>
                          <Tooltip id="candidate-skill-tooltip" />
                          <Tooltip id="additional-skills-tooltip" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600" data-tooltip-id="candidate-location-tooltip" data-tooltip-content="Candidate's location">
                            <MapPin size={14} className="mr-1" />
                            <span>{candidate.location || "Remote"}</span>
                          </div>
                          <Tooltip id="candidate-location-tooltip" />
                          <button className="text-primary text-sm font-medium flex items-center" data-tooltip-id="view-profile-button-tooltip" data-tooltip-content="View candidate's profile">
                            View Profile <ChevronRight size={16} />
                          </button>
                          <Tooltip id="view-profile-button-tooltip" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-400" data-tooltip-id="no-candidates-icon-tooltip" data-tooltip-content="No candidates found" />
              </div>
              <Tooltip id="no-candidates-icon-tooltip" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2" data-tooltip-id="no-candidates-title-tooltip" data-tooltip-content="No candidates found">
                No candidates found
              </h3>
              <Tooltip id="no-candidates-title-tooltip" />
              <p className="text-gray-600 max-w-md mx-auto mb-6" data-tooltip-id="no-candidates-description-tooltip" data-tooltip-content="Try adjusting your search criteria">
                Try adjusting your filters or broadening your search criteria
              </p>
              <Tooltip id="no-candidates-description-tooltip" />
              <button
                onClick={() => {
                  setFormData({
                    title: "",
                    skillsRequired: [],
                    description: "",
                  });
                  setFilteredCandidates([]);
                  sessionStorage.removeItem("candidateFilterState");
                  sessionStorage.removeItem("filteredCandidates");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                data-tooltip-id="clear-filters-button-tooltip"
                data-tooltip-content="Clear all filters"
              >
                Clear All Filters
              </button>
              <Tooltip id="clear-filters-button-tooltip" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCandidates;
