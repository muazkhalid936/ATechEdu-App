"use client";
import React, { useState, useEffect } from "react";
import api from "../../../../components/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
const page = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [value, setValue] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/sections");
        setSections(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLogin(false);
      }
    };
    fetchSections();
  }, []);

  const handleChange = (content) => {
    setValue(content);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleNoteChange = (content) => {
    setNote(content);
  };

  const handleDateChange = (e) => {
    setSubmissionDate(e.target.value);
  };

  const handleSave = async () => {
    const diaryEntry = {
      section_id: selectedSection,
      subject: subject,
      homework: value,
      note: note,
      submissionDate: submissionDate,
    };
    try {
      const response = await api.post("/dairies", diaryEntry);
      toast.success("Diary entry saved successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mx-2 rounded-lg p-4 bg-white">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            className="p-2 border rounded-md"
          >
            <option value="">Select a section</option>
            {sections &&
              sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
          </select>
          <input
            type="text"
            value={subject}
            onChange={handleSubjectChange}
            placeholder="Enter subject"
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={submissionDate}
            readOnly
            className="p-2 border rounded-md bg-gray-100"
          />
        </div>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "link",
            "image",
          ]}
          placeholder="Start typing homework..."
        />
        <ReactQuill
          theme="snow"
          value={note}
          onChange={handleNoteChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "link",
            "image",
          ]}
          placeholder="Add a note..."
        />

        <div className="flex justify-center">
          {" "}
          <button
            onClick={handleSave}
            className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Diary Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
