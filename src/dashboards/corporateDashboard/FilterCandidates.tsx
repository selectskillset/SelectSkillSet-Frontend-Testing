import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
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
  const [formData, setFormData] = useState({
    title: "",
    skillsRequired: [] as string[],
    description: "",
    jobDescriptionFile: null as File | null,
  });
  const [inputSkill, setInputSkill] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "skillsRequired") {
      setInputSkill(value);
      setSuggestedSkills(
        skillsData.filter(
          (skill) =>
            skill.toLowerCase().includes(value.toLowerCase()) &&
            !formData.skillsRequired.includes(skill)
        )
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        jobDescriptionFile: e.target.files[0],
      }));
    }
  };

  const handleAddSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: [...prev.skillsRequired, skill],
    }));
    setInputSkill("");
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      formData.skillsRequired.forEach((skill) =>
        data.append("skillsRequired[]", skill)
      );

      if (formData.jobDescriptionFile) {
        data.append("jobDescriptionFile", formData.jobDescriptionFile);
      }

      const response = await axiosInstance.post(
        "/corporate/candidates/filter",
        data
      );
      setFilteredCandidates(response.data.candidates || []);
      toast.success("Candidates filtered successfully!");
    } catch (error) {
      console.error("Error filtering candidates:", error);
      toast.error("Failed to filter candidates.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 p-6 bg-gray-50">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg rounded-xl w-full lg:w-1/3 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Filter Candidates
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Skills Required
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={inputSkill}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter skills"
            />
            {suggestedSkills.length > 0 && (
              <ul className="mt-2 bg-white border rounded-lg shadow-lg max-h-40 overflow-auto">
                {suggestedSkills.map((skill) => (
                  <li
                    key={skill}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex gap-2 flex-wrap">
              {formData.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill} ✖
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Upload JD
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-gradient-to-r  bg-[#0077b5] text-white px-4 py-2 rounded-lg hover:bg-[#005a94]  hover:opacity-90 transition"
          >
            {loading ? (
              <Loader2Icon className="animate-spin mx-auto" />
            ) : (
              "Filter Candidates"
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Filtered Candidates
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2Icon className="animate-spin text-blue-600 text-2xl" />
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-3 px-4 text-left">Profile</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Skills</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="border-t hover:bg-gray-100"
                    onClick={() => openModal(candidate)}
                  >
                    <td className="py-3 px-4">
                      <img
                        src={
                          candidate.profilePhoto ||
                          "https://via.placeholder.com/40"
                        }
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="py-3 px-4">
                      {candidate.skills.join(", ") || "No skills provided"}
                    </td>
                    <td className="py-3 px-4">
                      {candidate.location || "Not specified"}
                    </td>
                    <td className="py-3 px-4">
                      {candidate.statistics.averageRating.toFixed(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Candidate Modal */}
      {isModalOpen && selectedCandidate && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 w-3/4 max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedCandidate.firstName} {selectedCandidate.lastName}
            </h3>
            <img
              src={
                selectedCandidate.profilePhoto ||
                "https://via.placeholder.com/150"
              }
              alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <div className="space-y-4">
              <div>
                <strong>Email:</strong> {selectedCandidate.email}
              </div>
              <div>
                <strong>Mobile:</strong> {selectedCandidate.mobile}
              </div>
              <div>
                <strong>Location:</strong>{" "}
                {selectedCandidate.location || "Not specified"}
              </div>
              <div>
                <strong>Resume:</strong>{" "}
                <a
                  href={selectedCandidate.resume}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Resume
                </a>
              </div>
              <div>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={selectedCandidate.linkedIn}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Profile
                </a>
              </div>
              <div>
                <strong>Skills:</strong> {selectedCandidate.skills.join(", ")}
              </div>
              <div>
                <strong>Rating:</strong>{" "}
                {selectedCandidate.statistics.averageRating.toFixed(1)}
              </div>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterCandidates;
