import { useState } from "react";
import Image from "next/image";
import api from "../../components/axios";
import { toast } from "react-toastify";
const ProfileModal = ({ isOpen, onClose, userData, refreshData }) => {
  const [formData, setFormData] = useState({
    username: userData.username || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    password: "",
    status: userData.status || false,
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (avatar) formDataToSend.append("avatar", avatar);

      console.log("Form data entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[1], "check");
      }

      await api.post("/profile/update", formData);
      toast.success("Profile updated successfully!");
      refreshData();
      onClose();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src={
                  avatar
                    ? URL.createObjectURL(avatar)
                    : userData.avatar || "/avatar.png"
                }
                alt="Profile avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            {Object.keys(formData).map(
              (field) =>
                field !== "status" && (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm font-medium capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="border rounded-md p-2 mt-1"
                      placeholder={`Enter ${field.replace("_", " ")}`}
                    />
                  </div>
                )
            )}
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
