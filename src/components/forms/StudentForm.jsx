"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";
import { toast } from "react-toastify";
import api from "../axios";

const schema = z.object({
  student_id: z
    .string()
    .min(3, { message: "Student ID must be at least 3 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  blood_type: z.string().min(1, { message: "Blood Type is required!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  date_of_birth: z
    .string()
    .min(1, { message: "Birthday is required!" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["male", "female"], { message: "Gender is required!" }),
  section_id: z.string().min(1, { message: "Section is required!" }),
  grade: z.string().min(1, { message: "Grade is required!" }),
  date_of_admission: z
    .string()
    .min(1, { message: "Date of admission is required!" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  siblings: z.string(),
  reference: z.string(),
  vaccination: z.string(),
  disability: z.string(),
  medical_record: z.string(),
  family_instructions: z.string(),
});

const updateSchema = schema.omit({ student_id: true, password: true });

const StudentForm = ({ type, data }) => {
  let s_id;
  console.log(type);
  if (type == "update") {
    s_id = data.id;
  }

  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState([]);
  const [grade, setGrade] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(type === "create" ? schema : updateSchema),
  });

  useEffect(() => {
    const fetchClassrooms = async () => {
      const response = await api.get("/classes");
      setGrade(response.data.data);
      console.log(response.data.data);
    };
    const fetchSections = async () => {
      const response = await api.get("/sections");
      setSection(response.data.data);
      console.log(response.data.data);
    };
    fetchSections();
    fetchClassrooms();
  }, []);

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log("Form Data:", formData);
    const parsedData = {
      ...formData,
      date_of_birth: new Date(formData.date_of_birth),
    };
    console.log("Parsed Data:", parsedData);

    if (type !== "create") {
      delete parsedData.student_id;
      delete parsedData.password;
    }

    try {
      if (type === "create") {
        try {
          const response = await api.post("/students", parsedData);
          if (response.status) {
            toast.success("Student created successfully");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to create student. Please try again.");
          console.log("Create error:", error);
        }
      } else {
        try {
          const response = await api.put(`/students/${s_id}`, parsedData);
          if (response.status) {
            toast.success("Student updated successfully");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to update student. Please try again.");
          console.log("Update error:", error);
        }
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col p-5 overflow-y-auto max-h-[500px] gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Student ID"
          name="student_id"
          defaultValue={data?.student_id}
          register={register}
          error={errors?.student_id}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="first_name"
          defaultValue={data?.first_name}
          register={register}
          error={errors.first_name}
        />
        <InputField
          label="Last Name"
          name="last_name"
          defaultValue={data?.last_name}
          register={register}
          error={errors.last_name}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Birthday"
          name="date_of_birth"
          defaultValue={data?.date_of_birth}
          register={register}
          error={errors.date_of_birth}
          type="date"
        />

        <InputField
          label="Blood Type"
          name="blood_type"
          defaultValue={data?.blood_type}
          register={register}
          error={errors.blood_type}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gender")}
            defaultValue={data?.gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">
              {errors.gender.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("grade")}
            defaultValue={data?.grade}
          >
            <option value="">Select a grade</option>
            {grade.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.grade?.message && (
            <p className="text-xs text-red-400">
              {errors.grade.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Section</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("section_id")}
            defaultValue={data?.section_name}
          >
            <option value="">Select a section</option>
            {section.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
          {errors.section_id?.message && (
            <p className="text-xs text-red-400">
              {errors.section_id.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Date of Admission"
          name="date_of_admission"
          defaultValue={data?.date_of_admission}
          register={register}
          error={errors.date_of_admission}
          type="date"
        />
        <InputField
          label="Siblings"
          name="siblings"
          defaultValue={data?.siblings}
          register={register}
          error={errors.siblings}
        />
        <InputField
          label="Reference"
          name="reference"
          defaultValue={data?.reference}
          register={register}
          error={errors.reference}
        />
        <InputField
          label="Vaccination"
          name="vaccination"
          defaultValue={data?.vaccination}
          register={register}
          error={errors.vaccination}
        />
        <InputField
          label="Disability"
          name="disability"
          defaultValue={data?.disability}
          register={register}
          error={errors.disability}
        />
        <InputField
          label="Medical Record"
          name="medical_record"
          defaultValue={data?.medical_record}
          register={register}
          error={errors.medical_record}
        />
        <InputField
          label="Family Instructions"
          name="family_instructions"
          defaultValue={data?.family_instructions}
          register={register}
          error={errors.family_instructions}
        />
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

export default StudentForm;
