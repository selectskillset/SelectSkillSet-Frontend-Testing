import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, LogOut, Edit } from "lucide-react";
import { useCandidate } from "../../../context/CandidateContext";

const CandidateAccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { profile} = useCandidate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("candidateToken");
    navigate("/");
  };

  // Handle Delete Account (Placeholder for actual deletion logic)
  const handleDeleteAccount = () => {
    console.log("Account deletion logic goes here...");
    setIsDeleteModalOpen(false);
    sessionStorage.removeItem("candidateToken");
    navigate("/");
  };

  return (
    <div className="p-6 ">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Account Settings
      </h3>
      <p className="text-gray-600 mb-4">
        Manage your account preferences and security settings.
      </p>

      {/* Account Details Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <span className="text-sm text-gray-600">
            {profile?.email  || "Loading..."} 
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <button className="text-[#0A66C2] hover:text-[#005885] transition duration-300">
            Reset Password
          </button>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Link
        to="/edit-candidate-profile"
        className="flex items-center  gap-2 w-max bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:bg-[#005885] transition duration-300"
      >
        <Edit />
        Edit Profile
      </Link>

      {/* Logout and Delete Account Section */}
      <div className="mt-8 space-y-4">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-red-600 hover:text-red-700 transition duration-300 justify-start"
        >
          <LogOut size={20} />
          Logout
        </button>

        {/* Delete Account Button */}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 w-full text-red-600 hover:text-red-700 transition duration-300 justify-start"
        >
          <Trash2 size={20} />
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Account
            </h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition duration-300 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateAccountSettings;
