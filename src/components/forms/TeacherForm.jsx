"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import InputField from "../InputField";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import api from "../axios";

const createSchema = z.object({
  teacher_id: z
    .string()
    .min(3, { message: "Teacher ID must be at least 3 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  first_name: z.string().min(1, { message: "First name is required!" }),
  last_name: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  qualification: z.string().min(1, { message: "Qualification is required!" }),
  specialization: z.string().min(1, { message: "Specialization is required!" }),
  blood_type: z.string().min(1, { message: "Blood Type is required!" }),
  date_of_birth: z
    .string()
    .min(1, { message: "Birthday is required!" })
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["male", "female"], { message: "Gender is required!" }),
  vaccination: z.string().min(1, { message: "Vaccination status is required!" }),
});

const updateSchema = createSchema.omit({ teacher_id: true, password: true });

const TeacherForm = ({ type, data }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(type === "create" ? createSchema : updateSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    const parsedData = {
      ...formData,
      date_of_birth: new Date(formData.date_of_birth),
    };

    if (type !== "create") {
      delete parsedData.teacher_id;
      delete parsedData.password;
    }

    try {
      if (type === "create") {
        const response = await api.post("/teachers", parsedData);
        if (response.status) {
          toast.success("Teacher created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const response = await api.put(`/teachers/${data}`, parsedData);
        if (response.status) {
            toast.success("Teacher updated successfully");
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
    <form
      className="flex overflow-y-auto max-h-[500px] p-5 flex-col gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {type === "create" && (
          <>
            {" "}
            <InputField
              label="Teacher ID"
              name="teacher_id"
              defaultValue={data?.teacher_id}
              register={register}
              error={errors?.teacher_id}
            />
          </>
        )}
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        {type === "create" && (
          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors?.password}
          />
        )}
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
          label="Specialization"
          name="specialization"
          defaultValue={data?.specialization}
          register={register}
          error={errors.specialization}
        />
        <InputField
          label="Qualification"
          name="qualification"
          defaultValue={data?.qualification}
          register={register}
          error={errors.qualification}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="blood_type"
          defaultValue={data?.blood_type}
          register={register}
          error={errors.blood_type}
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
          label="Vaccination Status"
          name="vaccination"
          defaultValue={data?.vaccination}
          register={register}
          error={errors.vaccination}
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

export default TeacherForm;
