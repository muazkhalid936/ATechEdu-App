"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const urduFont = "YOUR_BASE64_ENCODED_FONT_HERE";

const TestEditor: React.FC = () => {
  const [content, setContent] = useState("");

  const handleExport = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("NotoSansUrdu.ttf", urduFont);
    doc.addFont("NotoSansUrdu.ttf", "NotoSansUrdu", "normal");

    if (typeof document !== "undefined") {
      doc.addImage("/logo.png", "PNG", 10, 10, 50, 20);
      doc.setFontSize(20);
      doc.setFont("NotoSansUrdu", "normal");
      doc.text("School Name", 70, 20);
      doc.setFontSize(14);
      doc.text("Name: __________________", 10, 50);
      doc.text("Roll: __________________", 140, 50);

      const parser = new DOMParser();
      const docContent = parser.parseFromString(content, "text/html");
      const paragraphs = Array.from(docContent.body.querySelectorAll("p"));
      const lines = paragraphs.map((paragraph) => {
        const text = paragraph.textContent;
        return text ? text : "";
      });

      const startY = 85;
      let currentY = startY;

      doc.setFontSize(12);
      lines.forEach((line) => {
        if (line.trim()) {
          doc.text(line, 10, currentY);
          currentY += 10;
        }
      });

      doc.save("test.pdf");
    }
  };

  return (
    <div className="test-editor flex flex-col gap-2">
      <h1>Create a Test</h1>
      <ReactQuill value={content} onChange={setContent} />
      <div className="flex items-center justify-center">
        <button
          onClick={handleExport}
          className="text-white bg-lamaPurple rounded-2xl mt-10 font-bold py-2 px-4"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default TestEditor;
