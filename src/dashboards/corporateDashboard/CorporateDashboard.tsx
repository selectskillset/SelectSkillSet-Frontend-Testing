import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Edit, Filter } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import { useNavigate } from "react-router-dom";

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
  linkedIn?: string;
  statistics: {
    averageRating: number;
  };
}

interface CorporateProfile {
  contactName: string;
  email: string;
  profilePhoto: string;
  phoneNumber: string;
  countryCode: string;
  companyName: string;
  bookmarks: Array<{ candidateId: string }>;
}

const candidatesPerPage = 5;

const CorporateDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCandidates, setTotalCandidates] = useState<number>(0);
  const [profile, setProfile] = useState<CorporateProfile | null>(null);

  const navigate = useNavigate();

  const fetchCandidates = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/corporate/getAllCandidates", {
        params: { page, limit: candidatesPerPage },
      });
      const { candidates: fetchedCandidates, total } = response.data || {};
      setCandidates(fetchedCandidates || []);
      setTotalCandidates(total || 0);
      toast.success("Candidates fetched successfully!");
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/corporate/getProfile");
      setProfile(response.data?.corporate || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile.");
    }
  }, []);

  useEffect(() => {
    fetchCandidates(currentPage);
    fetchProfile();
  }, [currentPage, fetchCandidates, fetchProfile]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= Math.ceil(totalCandidates / candidatesPerPage)) {
        setCurrentPage(page);
      }
    },
    [totalCandidates]
  );

  const handleCloseModal = () => setSelectedCandidate(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg rounded-lg lg:w-1/4 p-6 m-5">
        {profile && (
          <div className="flex flex-col items-center">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-28 h-28 rounded-full mb-4 border-4 border-[#0077b5] shadow-lg"
            />
            <h2 className="text-xl font-semibold text-[#0077b5]">
              {profile.companyName}
            </h2>
            <p className="text-sm text-gray-600">{profile.contactName}</p>
            <button
              className="mt-4 text-[#0077b5] hover:text-[#005885] flex items-center gap-2"
              onClick={() => navigate("/corporate/edit-profile")}
            >
              <Edit className="w-5 h-5" /> Edit Profile
            </button>

            <div className="mt-8 border-t border-gray-200 pt-6 w-full">
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="font-medium">Email</span>
                  <span className="text-sm text-[#0077b5]">
                    {profile.email}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Phone</span>
                  <span className="text-sm text-[#0077b5]">
                    {profile.countryCode} {profile.phoneNumber}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Bookmarks</span>
                  <span className="text-2xl font-semibold text-[#0077b5]">
                    {profile.bookmarks.length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-semibold text-gray-700">
            Corporate Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage your job posts and candidate applications here.
          </p>
        </div>

        {/* Candidate List */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Candidates</h2>
            <button
              className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2 rounded-lg hover:bg-[#005a94]"
              onClick={() => navigate("/corporate/filter-candidate")}
            >
              <Filter size={16} /> Filter
            </button>
          </div>
          {loading ? (
            <div className="text-center py-6">Loading candidates...</div>
          ) : (
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-gray-600">Profile</th>
                  <th className="py-2 px-4 text-gray-600">Name</th>
                  <th className="py-2 px-4 text-gray-600">Skills</th>
                  <th className="py-2 px-4 text-gray-600">Location</th>
                  <th className="py-2 px-4 text-gray-600">Rating</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <tr
                      key={candidate._id}
                      className="border-t hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
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
                      No candidates available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-[#0077b5] text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-center">Page {currentPage}</div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(totalCandidates / candidatesPerPage)
              }
              className="bg-[#0077b5] text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Candidate Modal */}
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCloseModal}
          >
            <div className="bg-white rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/3 p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-600"
              >
                ✖
              </button>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Candidate Details
              </h3>
              <div className="space-y-4">
                <div>
                  <strong>Name:</strong> {selectedCandidate.firstName}{" "}
                  {selectedCandidate.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedCandidate.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedCandidate.mobile}
                </div>
                <div>
                  <strong>Skills:</strong>{" "}
                  {selectedCandidate.skills.join(", ") || "No skills provided"}
                </div>
                <div>
                  <strong>Location:</strong>{" "}
                  {selectedCandidate.location || "Not specified"}
                </div>
                <div>
                  <strong>Rating:</strong>{" "}
                  {selectedCandidate.statistics.averageRating.toFixed(1)}
                </div>
                <div>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={selectedCandidate.resume}
                    className="text-[#0077b5] hover:underline"
                  >
                    View Resume
                  </a>
                </div>
                {selectedCandidate.linkedIn && (
                  <div>
                    <strong>LinkedIn:</strong>{" "}
                    <a
                      href={selectedCandidate.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077b5] hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CorporateDashboard;
