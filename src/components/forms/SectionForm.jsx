"use client";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import api from "../axios";

const SectionForm = ({ type, data }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formType, setFormType] = useState("");
  const [showStudents, setShowStudents] = useState(false);
  const [sectionStudents, setSectionStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchClasses = async () => {
    setFormType(type);
    console.log(formType, data, "asd");
    try {
      const response = await api.get("/classes");
      setClasses(response.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchSectionStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/students?section_id=${data.id}`);
      setSectionStudents(response.data.data.listing);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleViewStudents = () => {
    setShowStudents(!showStudents);
    if (!showStudents && sectionStudents.length === 0) {
      fetchSectionStudents();
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      if (formType === "update") {
        if (!formData.name || !formData.capacity || !formData.class_id) {
          toast.error("Please fill in all required fields");
          setLoading(false);
          return;
        }
      }

      if (formType === "create") {
        const response = await api.post("/sections", formData);
        if (response.status) {
          toast.success("Section created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if (formType === "update") {
        const response = await api.put(`/sections/${data.id}`, formData);
        if (response.status) {
          toast.success("Section updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 overflow-y-scroll max-h-[calc(100vh-100px)]">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {formType === "update" ? "Update Section" : "Create Section"}
          </h1>
          {formType !== "create" && (
            <div className="flex gap-4 mt-5">
              <button
                type="button"
                onClick={() => setFormType("update")}
                className={`px-4 py-2 rounded-md ${
                  formType === "update" ? "bg-blue-400 text-white" : "bg-gray-200"
                }`}
              >
                Update Info
              </button>
              <button
                type="button"
                onClick={handleViewStudents}
                className={`px-4 py-2 rounded-md ${
                  showStudents ? "bg-green-600" : "bg-green-500"
                } text-white`}
              >
                {showStudents ? "Hide Students" : "View Students"}
              </button>
            </div>
          )}
        </div>

        {formType === "update" && (
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Section Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name && { message: "Section name is required!" }}
              required
            />
            <InputField
              label="Capacity"
              name="capacity"
              formType="number"
              defaultValue={data?.capacity}
              register={register}
              error={errors?.capacity && { message: "Capacity is required!" }}
              required
            />
            <div className="flex flex-col gap-2 w-full">
              <label>Class</label>
              <select
                {...register("class_id")}
                defaultValue={data?.class_id}
                className="p-2 border rounded-md outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
              {errors?.class_id && (
                <span className="text-red-500 text-sm">
                  {errors.class_id.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="status"
                {...register("status")}
                defaultChecked={data?.status}
              />
              <label htmlFor="status">Active</label>
            </div>
          </div>
        )}
        {formType === "create" && (
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Section Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name && { message: "Section name is required!" }}
              required
            />
            <InputField
              label="Capacity"
              name="capacity"
              formType="number"
              defaultValue={data?.capacity}
              register={register}
              error={errors?.capacity && { message: "Capacity is required!" }}
              required
            />
            <div className="flex flex-col gap-2 w-full">
              <label>Class</label>
              <select
                {...register("class_id")}
                defaultValue={data?.class_id}
                className="p-2 border rounded-md outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
              {errors?.class_id && (
                <span className="text-red-500 text-sm">
                  {errors.class_id.message}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          className="bg-blue-400 text-white p-2 rounded-md flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#ffffff" />
              <span>Loading...</span>
            </>
          ) : formType === "update" ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </form>

      {/* Students List Section */}
      {showStudents && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Enrolled Students</h2>
          {loadingStudents ? (
            <div className="flex justify-center">
              <ClipLoader size={30} color="#3B82F6" />
            </div>
          ) : sectionStudents.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sectionStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.user.first_name} {student.user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.student_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No students enrolled in this section.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionForm;
