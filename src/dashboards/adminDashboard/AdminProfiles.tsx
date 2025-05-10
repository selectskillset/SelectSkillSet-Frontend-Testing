import { useEffect, useState } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import {toast} from "sonner";
import { Edit, Trash } from "lucide-react";
import { Button } from "../../components/ui/Button";

const AdminProfiles = () => {
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });

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

  // Confirm Delete Admin
  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center space-y-2">
          <p>Are you sure you want to delete this admin?</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleDelete(id);
                toast.dismiss(t.id);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes
            </Button>
            <Button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              No
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profiles</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0073b1] text-white hover:bg-[#005f99]"
        >
          Add Admin
        </Button>
      </div>

      {/* Admin Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold">Name</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Email</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} className="border-b border-gray-200">
                <td className="py-4 px-4">
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
                      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    admin.username
                  )}
                </td>
                <td className="py-4 px-4">
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
                      className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    admin.email
                  )}
                </td>
                <td className="py-4 px-4 flex gap-2">
                  {isEditing === admin._id ? (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(admin)}
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        onClick={() => confirmDelete(admin._id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash size={16} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Admin
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, username: e.target.value })
                  }
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAdmin}
                  className="bg-[#0073b1] text-white hover:bg-[#005f99]"
                >
                  Add Admin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfiles;
