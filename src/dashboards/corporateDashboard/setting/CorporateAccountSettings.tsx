import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, LogOut, Edit, User2, X } from "lucide-react";
import { useCorporate } from "../../../context/CorporateContext";

const CorporateAccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { profile } = useCorporate();

  const handleLogout = () => {
    sessionStorage.removeItem("corporateToken");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion logic goes here...");
    setIsDeleteModalOpen(false);
    sessionStorage.removeItem("corporateToken");
    navigate("/login");
  };

  return (
    <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <User2 className="text-primary" size={24} />
          <h1 className="text-2xl font-semibold text-gray-800">
            Account Settings
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Manage your account preferences and security settings.
        </p>
      </div>

      {/* Account Details Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Account Information
        </h2>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
              <p className="text-sm text-gray-600 break-all">
                {profile?.email || "Loading..."}
              </p>
            </div>
            <button
              onClick={() => navigate("/corporate/edit-profile")}
              className="text-sm text-primary hover:text-secondary hover:underline self-start sm:self-auto"
            >
              Update Email
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mb-10">
        <Link
          to="/corporate/edit-profile"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-secondary transition-colors duration-200 text-sm font-medium"
        >
          <Edit size={18} />
          Edit Profile
        </Link>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-medium text-gray-800 mb-6">Danger Zone</h2>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full p-3 rounded-lg border border-red-100 hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors duration-200 w-full p-3 rounded-lg border border-red-100 hover:bg-red-50"
          >
            <Trash2 size={18} />
            <span className="font-medium">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Account
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and will permanently:
              </p>
              <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-1">
                <li>Remove all your company data</li>
                <li>Remove access for all team members</li>
              </ul>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 rounded-lg"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateAccountSettings;
