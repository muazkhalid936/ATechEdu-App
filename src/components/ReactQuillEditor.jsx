"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const ReactQuillEditor = () => {
  const [value, setValue] = useState("");

  const handleChange = (content) => {
    setValue(content);
    console.log("Content:", content);
  };

  return (
    <div>
      <div>
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
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

export default ReactQuillEditor;
