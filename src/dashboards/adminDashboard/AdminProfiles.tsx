import { useEffect, useState } from "react";
import axiosInstance from "../../components/common/axiosConfig";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";
import { Button } from "../../components/ui/Button";

const AdminProfiles = () => {
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedAdmin, setEditedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });

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

  const handleEdit = (admin) => {
    setIsEditing(admin._id);
    setEditedAdmin({ ...admin });
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/admin/update", editedAdmin);
      if (response.data.message === "Admin updated successfully") {
        toast.success(response.data.message);
        setAdmins(
          admins.map((admin) =>
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

  const handleCancel = () => {
    setIsEditing(null);
    setEditedAdmin(null);
  };

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p className="text-lg font-semibold">
            Are you sure you want to delete this admin?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              className="bg-[#0073b1] text-white"
              onClick={() => {
                handleDelete(id);
                toast.dismiss(t.id);
              }}
            >
              Yes
            </Button>
            <Button
              className="bg-gray-500 text-white"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </Button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete("/admin/delete", {
        data: { id },
      });
      if (response.data.message === "Admin deleted successfully") {
        toast.success(response.data.message);
        setAdmins(admins.filter((admin) => admin._id !== id));
      } else {
        toast.error("Failed to delete admin");
      }
    } catch (error) {
      toast.error("An error occurred while deleting admin");
      console.error(error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await axiosInstance.post("/admin/create", newAdmin);
      if (response.data.message === "Admin created successfully") {
        toast.success(response.data.message);
        setAdmins([...admins, response.data.admin]);
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
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#0073b1] mb-8">
          Admin Profiles
        </h1>

        <div className="mb-6 text-right">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0073b1] text-white"
          >
            Add Admin
          </Button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#0073b1] text-white">
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Email</th>
                <th className="border border-gray-300 p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">
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
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ) : (
                      admin.username
                    )}
                  </td>
                  <td className="border border-gray-300 p-3">
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
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ) : (
                      admin.email
                    )}
                  </td>
                  <td className="border border-gray-300 p-3 flex gap-2">
                    {isEditing === admin._id ? (
                      <>
                        <Button
                          onClick={handleSave}
                          className="bg-green-500 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          className="bg-red-500 text-white"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(admin)}
                          className="bg-yellow-500 text-white"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => confirmDelete(admin._id)}
                          className="bg-red-500 text-white"
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAdmin}
                className="bg-blue-500 text-white"
              >
                Add Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfiles;
