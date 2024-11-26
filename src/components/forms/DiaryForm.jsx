"use client";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import api from "../axios";

const DiaryForm = ({ type, data }) => {
  const [formData, setFormData] = useState({
    section_id: data?.section_id || "",
    subject: data?.subject || "",
    homework: data?.homework || "",
    remarks: data?.remarks || "",
    submission_date: data?.submission_date || new Date().toISOString().split("T")[0],
  });
  const [sections, setSections] = useState([]);

  React.useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/sections");
        setSections(response.data.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "create") {
        await api.post("/diaries", formData);
        toast.success("Diary entry created successfully");
      } else if (type === "update") {
        await api.put(`/diaries/${data.id}`, formData);
        toast.success("Diary entry updated successfully");
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold mb-4">
        {type === "create" ? "Create New Diary Entry" : "Update Diary Entry"}
      </h1>

      <div className="flex flex-col gap-2">
        <label>Section</label>
        <select
          value={formData.section_id}
          onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
          className="p-2 border rounded-md"
          required
        >
          <option value="">Select a section</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label>Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="p-2 border rounded-md"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Homework</label>
        <ReactQuill
          theme="snow"
          value={formData.homework}
          onChange={(content) => setFormData({ ...formData, homework: content })}
          modules={quillModules}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Remarks</label>
        <ReactQuill
          theme="snow"
          value={formData.remarks}
          onChange={(content) => setFormData({ ...formData, remarks: content })}
          modules={quillModules}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DiaryForm;
