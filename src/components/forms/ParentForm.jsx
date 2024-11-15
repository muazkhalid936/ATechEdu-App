"use client";

import InputFieldP from "../InputFieldP";
import { toast } from "react-toastify";
import Select from "react-select";
import { useState } from "react";
import api from "../axios";
import { ClipLoader } from "react-spinners";

const ParentForm = ({ type, data }) => {
  // console.log(data);
  // const p_id = data.id;
  const [loading, setLoading] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  // console.log(data.students, "asd");
  const [formData, setFormData] = useState({
    email: data?.email || "",
    password: type === "create" ? "" : undefined,
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    phone: data?.phone || "",
    address: data?.address || "",
    occupation: data?.occupation || "",
    relationship: data?.relationship || "",
    gender: data?.gender || "male",
    student_id: data?.student_id || [],
  });

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address!";
    }

    // Password validation (only for create)
    if (
      type === "create" &&
      (!formData.password || formData.password.length < 8)
    ) {
      newErrors.password = "Password must be at least 8 characters long!";
    }

    // Required field validations
    if (!formData.first_name) newErrors.first_name = "First name is required!";
    if (!formData.last_name) newErrors.last_name = "Last name is required!";
    if (!formData.phone) newErrors.phone = "Phone is required!";
    if (!formData.address) newErrors.address = "Address is required!";
    if (!formData.occupation) newErrors.occupation = "Occupation is required!";
    if (!formData.relationship)
      newErrors.relationship = "Relationship is required!";
    if (!["male", "female"].includes(formData.gender))
      newErrors.gender = "Gender is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    console.log("Selected students:", values);
    setFormData((prev) => ({
      ...prev,
      student_id: values,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare the API payload with student_ids array
      const apiPayload = {
        ...formData,
        student_ids: formData.student_id, // Rename student_id to student_ids to match API expectation
      };
      delete apiPayload.student_id; // Remove the old student_id field

      if (type === "create") {
        const response = await api.post("/parents", apiPayload);
        if (response.status) {
          toast.success("Parent created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const response = await api.put(`/parents/${p_id}`, apiPayload);
        console.log(response, apiPayload);
        if (response.status) {
          toast.success("Parent updated successfully");
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

  const onStudentNameInputChange = async (e) => {
    // Don't make API call if search string is empty
    console.log(e);
    if (!e || e.trim() === "") {
      setStudentOptions([]);
      return;
    }

    try {
      const response = await api.get(
        `/students?page=${page}&size=${pageSize}&search=${e}`
      );

      const mappedOptions = response.data.data.listing.map((student) => ({
        value: student.id,
        label: `${student.student_id} - ${student.user.first_name} ${student.user.last_name}`,
      }));

      // Merge existing selected students with new search results
      const selectedStudents = studentOptions.filter((student) =>
        formData.student_id.includes(student.value)
      );

      const newOptions = [
        ...new Map(
          [...selectedStudents, ...mappedOptions].map((item) => [
            item.value,
            item,
          ])
        ).values(),
      ];

      setStudentOptions(newOptions);
    } catch (error) {
      // Error handling...
    }
  };

  return (
    <form
      className="flex h-[80vh] overflow-y-auto p-5 flex-col gap-8"
      onSubmit={onSubmit}
      noValidate
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Parent" : "Update Parent"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputFieldP
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        {type === "create" && (
          <InputFieldP
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
        )}
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Student Information
      </span>
      <div className="flex flex-col gap-4">
        <InputFieldP
          label="Student Name"
          name="student_name"
          defaultValue={data?.student_name}
          value={formData.student_name}
          onChange={(e) => {
            handleChange(e);
            onStudentNameInputChange(e.target.value);
          }}
          placeholder="Enter student name to search"
        />

        {studentOptions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentOptions.map((student) => (
                  <tr key={student.value}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input
                        type="checkbox"
                        checked={formData.student_id.includes(student.value)}
                        onChange={() => {
                          const newStudentIds = formData.student_id.includes(
                            student.value
                          )
                            ? formData.student_id.filter(
                                (id) => id !== student.value
                              )
                            : [...formData.student_id, student.value];
                          console.log(
                            "Updated student selection:",
                            newStudentIds
                          );
                          setFormData((prev) => ({
                            ...prev,
                            student_id: newStudentIds,
                          }));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {formData.student_id.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <h3 className="text-sm font-medium mb-2">Selected Students</h3>
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentOptions
                  .filter((student) =>
                    formData.student_id.includes(student.value)
                  )
                  .map((student) => (
                    <tr key={`selected-${student.value}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              student_id: prev.student_id.filter(
                                (id) => id !== student.value
                              ),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {errors.student_id && (
          <p className="text-xs text-red-400">{errors.student_id}</p>
        )}
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputFieldP
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
        />
        <InputFieldP
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
        />
        <InputFieldP
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <InputFieldP
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
        <InputFieldP
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          error={errors.occupation}
        />
        <InputFieldP
          label="Relationship"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          error={errors.relationship}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            name="gender"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-red-400">{errors.gender}</p>
          )}
        </div>
      </div>
      <button
        className="bg-blue-400 text-white p-2 rounded-md flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <ClipLoader size={20} color="#ffffff" />
            <span>Loading...</span>
          </>
        ) : type === "create" ? (
          "Create"
        ) : (
          "Update"
        )}
      </button>
    </form>
  );
};

export default ParentForm;
