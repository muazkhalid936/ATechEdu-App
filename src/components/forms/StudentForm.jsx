"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
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
  grade: z.string().min(1, { message: "grade is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  date_of_birth: z
    .string()
    .min(1, { message: "Birthday is required!" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["male", "female"], { message: "Gender is required!" }),
});

const updateSchema = schema.omit({ student_id: true, password: true });

const StudentForm = ({ type, data }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(type === "create" ? schema : updateSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    const parsedData = {
      ...formData,
      date_of_birth: new Date(formData.date_of_birth),
    };

    if (type !== "create") {
      delete parsedData.student_id;
      delete parsedData.password;
    }

    try {
      if (type === "create") {
        const response = await api.post("/students", parsedData);
        if (response.status) {
          toast.success("Student created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const response = await api.put(`/students/${data}`, parsedData);
        if (response.status) {
          toast.success("Student updated successfully");
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
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
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
          label="Grade"
          name="grade"
          defaultValue={data?.grade}
          register={register}
          error={errors.grade}
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
