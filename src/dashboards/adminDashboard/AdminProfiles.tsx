import { useEffect, useState } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import { toast } from "sonner";
import { Edit, Trash, Plus, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminProfiles = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Color scheme
  const primaryColor = "bg-primary";
  const secondaryColor = "bg-secondary";
  const hoverPrimaryColor = "hover:bg-primary-dark";
  const hoverSecondaryColor = "hover:bg-secondary-dark";

  // Fetch admin details
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/admin/getAll");
        if (response.data.message === "Admin details fetched successfully") {
          setAdmins(response.data.admins);
        } else {
          toast.error("Failed to fetch admin details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data");
        console.error(error);
      }
    };
    fetchAdmins();
  }, []);

  // Handle Edit Admin
  const handleEdit = (admin) => {
    setIsEditing(admin._id);
    setEditedAdmin({ ...admin });
  };

  // Handle Save Admin
  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/admin/update", editedAdmin);
      if (response.data.message === "Admin updated successfully") {
        toast.success(response.data.message);
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin._id === editedAdmin._id ? editedAdmin : admin
          )
        );
        setIsEditing(null);
        setEditedAdmin(null);
      } else {
        toast.error("Failed to update admin");
      }
    } catch (error) {
      toast.error("An error occurred while saving changes");
      console.error(error);
    }
  };

  // Handle Cancel Edit
  const handleCancel = () => {
    setIsEditing(null);
    setEditedAdmin(null);
  };

  // Handle Delete Admin
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete("/admin/delete", {
        data: { id },
      });
      if (response.data.message === "Admin deleted successfully") {
        toast.success(response.data.message);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin._id !== id)
        );
      } else {
        toast.error("Failed to delete admin");
      }
    } catch (error) {
      toast.error("An error occurred while deleting admin");
      console.error(error);
    }
  };

  // Handle Add Admin
  const handleAddAdmin = async () => {
    try {
      const response = await axiosInstance.post("/admin/create", newAdmin);
      if (response.data.message === "Admin created successfully") {
        toast.success(response.data.message);
        setAdmins((prevAdmins) => [...prevAdmins, response.data.admin]);
        setNewAdmin({ username: "", email: "", password: "" });
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create admin");
      }
    } catch (error) {
      toast.error("An error occurred while creating admin");
      console.error(error);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (id) => {
    setAdminToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setAdminToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-1">
            Manage administrator accounts and permissions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`${primaryColor} text-white ${hoverPrimaryColor} flex items-center gap-2 py-2 px-4 rounded`}
        >
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 sm:px-6 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="py-3 px-4 sm:px-6 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 sm:px-6 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <motion.tr
                  key={admin._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-primary" size={18} />
                      </div>
                      <div className="ml-4">
                        {isEditing === admin._id ? (
                          <input
                            type="text"
                            value={editedAdmin?.username || ""}
                            onChange={(e) =>
                              setEditedAdmin({
                                ...editedAdmin,
                                username: e.target.value,
                              })
                            }
                            className="border border-gray-300 bg-gray-50 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        ) : (
                          <>
                            <div className="text-sm font-medium text-gray-800">
                              {admin.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              Administrator
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {isEditing === admin._id ? (
                      <input
                        type="email"
                        value={editedAdmin?.email || ""}
                        onChange={(e) =>
                          setEditedAdmin({
                            ...editedAdmin,
                            email: e.target.value,
                          })
                        }
                        className="border border-gray-300 bg-gray-50 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div className="text-sm text-gray-800">{admin.email}</div>
                    )}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing === admin._id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-primary border border-primary hover:bg-blue-50 py-2 px-4 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(admin._id)}
                            className="text-red-600 border border-red-600 hover:bg-red-50 py-2 px-4 rounded"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <User className="text-gray-500" size={24} />
            </div>
            <h3 className="mt-4 font-medium text-gray-800">
              No administrators
            </h3>
            <p className="text-gray-600 mt-1">
              Add new admin accounts to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`${primaryColor} text-white ${hoverPrimaryColor} py-2 px-4 rounded mt-4`}
            >
              <span className="flex items-center">
                {" "}
                <Plus size={16} className="mr-2" />
                Add Admin
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Admin
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, username: e.target.value })
                    }
                    className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="border border-gray-300 bg-gray-50 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmin}
                  className={`${primaryColor} text-white ${hoverPrimaryColor} py-2 px-4 rounded`}
                >
                  Create Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Confirm Deletion
                </h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete this admin?
                </p>
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (adminToDelete) {
                      handleDelete(adminToDelete);
                      closeDeleteModal();
                    }
                  }}
                  className={`${secondaryColor} text-white ${hoverSecondaryColor} py-2 px-4 rounded`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfiles;
