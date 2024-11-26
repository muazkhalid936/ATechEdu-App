"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../axios";
import Image from "next/image";

const SchoolForm = ({ type, data }) => {
  let s_id = data.id;
  console.log(s_id);

  const [formData, setFormData] = useState({
    name: data?.name || "",
    logo: data?.logo || "",
    address: data?.address || "",
    email: data?.email || "",
    adminEmail: data?.adminEmail || "",
    adminPassword: data?.adminPassword || "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(data?.logo || null);
  const [modules, setModules] = useState([]);
  const [showModules, setShowModules] = useState(false);

  const fetchModules = async () => {
    try {
      const response = await api.get("/modules");
      setModules(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch modules");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const toggleModules = () => {
    setShowModules(!showModules);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only PNG, JPG, or JPEG files");
        e.target.value = "";
        return;
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setFormData({ ...formData, logo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "customizations") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (type === "create") {
        await api.post("/school/create", formDataToSend);
        toast.success("School created successfully");
      } else if (type === "update") {
        await api.put(`/school/${s_id}`, formDataToSend);
        toast.success("School updated successfully");
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll max-h-[90vh] p-4">
      <h1 className="text-xl font-bold mb-4">
        {type === "create" ? "Create New School" : "Update School"}
      </h1>

      {showModules ? (
        // Show modules when toggle is active
        <div className="mt-4">
          <h2 className="text-lg font-bold">Available Modules</h2>
          <ul>
            {modules.map((module) => (
              <div key={module.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`module-${module.id}`}
                  className="mr-2"
                />
                <label htmlFor={`module-${module.id}`}>
                  {module.name} - {module.description}
                </label>
              </div>
            ))}
          </ul>
          <button
            type="button"
            onClick={toggleModules}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-4"
          >
            Hide Modules
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label>Logo</label>
            <input
              type="file"
              onChange={handleLogoChange}
              className="border rounded-md p-2 w-full"
            />
            {logoPreview && (
              <Image
                src={logoPreview}
                alt="Logo Preview"
                width={100}
                height={100}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label>Admin Email</label>
            <input
              type="email"
              value={formData.adminEmail}
              onChange={(e) =>
                setFormData({ ...formData, adminEmail: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label>Admin Password</label>
            <input
              type="password"
              value={formData.adminPassword}
              onChange={(e) =>
                setFormData({ ...formData, adminPassword: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            />
          </div>

          <button
            type="button"
            onClick={toggleModules}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Assign Modules
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {type === "create" ? "Create School" : "Update School"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SchoolForm;
