"use client";
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Table from "./Table";
import Pagination from "./Pagination";
import Image from "next/image";
import api from "./axios";
import { toast } from "react-toastify";
const columns = [
  { header: "Roll#", accessor: "studentId" },
  { header: "Name", accessor: "name" },
  // {
  //   header: "Class",
  //   accessor: "class",

  //   className: "hidden md:table-cell",
  // },
  { header: "Status", accessor: "status" },
  { header: "Actions", accessor: "action" },
];

const Attendance = ({}) => {
  const [section, setSection] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classesData, setClassesData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const fetchSection = async (c_id) => {
    try {
      const res = await api.get(`/sections/?class_id=${c_id}`);
      setSection(res.data.data);
      console.log(section);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(`/classes`);
        setClassesData(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
      console.log(classesData);
    };
    fetchClasses();
  }, []);
  const handleClassChange = async (e) => {
    setStudents([]);
    const classId = e.target.value;
    if (classId) {
      fetchSection(classId);
    } else {
      setSection([]);
    }
    setSelectedClass(classId);
    setSelectedSection("");
  };

  const handleSectionChange = (e) => {
    console.log(e.target.value);

    const fetchStudents = async () => {
      try {
        const res = await api.get(`/students?section_id=${e.target.value}`);
        setStudents(res.data.data.listing);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
    setSelectedSection(e.target.value);
  };

  const handleMarkAttendance = async () => {
    try {
      const attendanceData = {
        section_id: parseInt(selectedSection),
        date: new Date().toISOString().split("T")[0],
        attendance_data: Object.entries(attendance).map(
          ([studentId, status]) => ({
            student_id: parseInt(studentId),
            status: status.toLowerCase(),
            remarks: status === "Present" ? "On time" : "Absent",
          })
        ),
      };

      await api.post("/attendance/mark", attendanceData);
      // console.log(attendanceData);
      toast.success("Attendance marked successfully");
    } catch (error) {
      toast.error("Error marking attendance:", error);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [["Roll#", "Name", "Class", "Status"]],
      body: students.map((student) => [
        student.student_id,
        student.user.first_name + " " + student.user.last_name,
        student.class,
        attendance[student.id] || "Not marked",
      ]),
    });

    doc.save("attendance_report.pdf");
  };

  const handleAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const renderRow = (student) => {
    if (student) {
      return (
        <tr
          key={student.id}
          className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
          <td className="p-4">{student.student_id}</td>
          <td>{student.user.first_name + " " + student.user.last_name}</td>
          <td>{attendance[student.id] || "Not marked"}</td>
          <td>
            <div className="flex items-center gap-2">
              <button
                className="text-green-600 mr-2"
                onClick={() => handleAttendance(student.id, "Present")}
              >
                Present
              </button>
              <button
                className="text-red-600"
                onClick={() => handleAttendance(student.id, "Absent")}
              >
                Absent
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td colSpan="4" className="text-center p-4">
          Select Class and Section
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-2xl my-3 font-semibold">Attendance Report</h1>
      <div className="flex items-center gap-4 flex-col lg:flex-row justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {" "}
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <select
              className="lg:w-[200px] w-full p-2 bg-transparent active:outline-none outline-none"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">Select Class</option>
              {classesData.data?.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <select
              className="lg:w-[200px] w-full p-2 bg-transparent active:outline-none outline-none"
              value={selectedSection}
              onChange={handleSectionChange}
            >
              <option value="">Select Section</option>
              {section?.map((sectionItem) => (
                <option key={sectionItem.id} value={sectionItem.id}>
                  {sectionItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              className="text-white bg-green-400 px-4 py-2"
              onClick={handleMarkAttendance}
            >
              Submit{" "}
            </button>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        renderRow={renderRow}
        data={students.map((student) => ({
          ...student,
          status: attendance[student.id] || "Null",
        }))}
      />
      {!selectedSection && (
        <div className="text-center p-4">
          Please select a section first
        </div>
      )}

      {/* <Pagination /> */}
    </div>
  );
};

export default Attendance;
