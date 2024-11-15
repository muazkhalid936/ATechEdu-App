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
  const [students, setStudents] = useState([]);
  const [formType, setFormType] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

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

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.data.listing);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

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
      } else if (formType === "assign") {
        console.log(
          "Selected Students:",
          students
            .filter((student) => selectedStudents.includes(student.id))
            .map((student) => ({
              id: student.id,
              name: `${student.user.first_name} ${student.user.last_name}`,
            }))
        );

        const response = await api.post(`/sections/${data.id}/students`, {
          student_ids: selectedStudents,
        });
        if (response.status) {
          toast.success("Students assigned successfully");
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
              onClick={() => setFormType("assign")}
              className={`px-4 py-2 rounded-md ${
                formType === "assign" ? "bg-blue-400 text-white" : "bg-gray-200"
              }`}
            >
              Assign Students
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

      {formType === "assign" && (
        <div className="flex flex-col gap-2 w-full">
          <label>Select Students</label>
          <div className="border rounded-md max-h-[300px] overflow-y-scroll overflow-x-auto">
            <table className="min-w-full ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Select</th>
                  <th className="p-3 text-left">Student ID</th>
                  <th className="p-3 text-left">First Name</th>
                  <th className="p-3 text-left">Last Name</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        value={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([
                              ...selectedStudents,
                              student.id,
                            ]);
                          } else {
                            setSelectedStudents(
                              selectedStudents.filter((id) => id !== student.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">{student.student_id}</td>
                    <td className="p-3">{student.user.first_name}</td>
                    <td className="p-3">{student.user.last_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors?.students && (
            <span className="text-red-500 text-sm">
              {errors.students.message}
            </span>
          )}
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
        ) : formType === "create" ? (
          "Create"
        ) : (
          "Assign Students"
        )}
      </button>
    </form>
  );
};

export default SectionForm;
