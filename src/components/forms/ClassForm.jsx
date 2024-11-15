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
  name: z.string().min(1, { message: "Class name is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  academic_year: z.string().min(1, { message: "Academic year is required!" }),
  status: z.boolean().optional(),
});

const ClassForm = ({ type, data }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      if (type === "create") {
        const response = await api.post("/classes", formData);
        if (response.status) {
          toast.success("Class created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const response = await api.put(`/classes/${data.id}`, formData);
        if (response.status) {
          toast.success("Class updated successfully");
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
        {type === "create" ? "Create a new class" : "Update class"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Academic Year"
          name="academic_year"
          defaultValue={data?.academic_year}
          register={register}
          error={errors?.academic_year}
        />
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

export default ClassForm; 