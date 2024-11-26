"use client";

import { Imprima } from "next/font/google";
import api from "../axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const ResultModal = ({ type, data, onClose }) => {
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [formData, setFormData] = useState({
    student_id: data?.student_id || "",
    section_id: data?.section_id || "",
    subject: data?.subject || "",
    marks_obtained: data?.marks_obtained || "",
    total_marks: data?.total_marks || "100",
    exam_type: data?.exam_type || "",
    remarks: data?.remarks || "",
  });

  useEffect(() => {
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

  const handleSectionChange = async (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    if (sectionId) {
      try {
        const response = await api.get(`/students?section_id=${sectionId}`);
        setStudents(response.data.data.listing);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "create") {
        const response = await api.post("/results", formData);
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const response = await api.put(`/results/${data.id}`, formData);
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Show section and student selects only for create */}
        {type === "create" && (
          <>
            {/* Section ID */}
            <div className="flex flex-col gap-2">
              <label>Section</label>
              <select
                name="section_id"
                required={type === "create"}
                defaultValue={formData.section_id}
                onChange={(e) => {
                  handleChange(e);
                  handleSectionChange(e);
                }}
                className="p-2 border rounded-md"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Student ID */}
            <div className="flex flex-col gap-2">
              <label>Student ID</label>
              <select
                name="student_id"
                required={type === "create"}
                defaultValue={formData.student_id}
                onChange={handleChange}
                className="p-2 border rounded-md"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user.first_name} {student.user.last_name}{" "}
                    {student.student_id}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                required={type === "create"}
                defaultValue={formData.subject}
                onChange={handleChange}
                className="p-2 border rounded-md"
              />
            </div>

            {/* Exam Type */}
            <div className="flex flex-col gap-2">
              <label>Exam Type</label>
              <select
                name="exam_type"
                required={type === "create"}
                defaultValue={formData.exam_type}
                onChange={handleChange}
                className="p-2 border rounded-md"
              >
                <option value="">Select Type</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
          </>
        )}

        {/* Always show these fields */}
        {/* Marks Obtained */}
        <div className="flex flex-col gap-2">
          <label>Marks Obtained</label>
          <input
            type="number"
            name="marks_obtained"
            required
            defaultValue={formData.marks_obtained}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
        </div>

        {/* Total Marks */}
        <div className="flex flex-col gap-2">
          <label>Total Marks</label>
          <input
            type="number"
            name="total_marks"
            required
            defaultValue={formData.total_marks}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="flex flex-col gap-2">
        <label>Remarks</label>
        <textarea
          name="remarks"
          defaultValue={formData.remarks}
          onChange={handleChange}
          className="p-2 border rounded-md"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-lamaPurple rounded-md hover:bg-lamaPurpleDark"
        >
          {type === "create" ? "Add Result" : "Update Result"}
        </button>
      </div>
    </form>
  );
};
export default ResultModal;
