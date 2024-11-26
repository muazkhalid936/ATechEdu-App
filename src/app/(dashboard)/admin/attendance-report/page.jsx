"use client";
import MonthlyReport from "../../../../components/MontlhyReport";
import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../../../../components/axios";
const AttendanceReport = () => {
  const month = "2023-10";

  const [section, setSection] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const fetchSection = async (c_id) => {
    try {
      const res = await api.get(`/sections/?class_id=${c_id}`);
      setSection(res.data.data);
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
    const sectionId = e.target.value;
    const fetchStudents = async () => {
      try {
        if (!startDate || !endDate) {
          alert("Please select both start and end dates");
          return;
        }

        const res = await api.get(
          `/attendance/report?section_id=${sectionId}&start_date=${startDate}&end_date=${endDate}`
        );
        setStudents(res.data.data);
        console.log(res);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
    setSelectedSection(sectionId);
  };

  const getAttendanceCount = (studentId) => {
    const studentRecords = attendanceData.filter(
      (record) => record.studentId === studentId
    );
    const presentCount = studentRecords.filter(
      (record) => record.status === "Present"
    ).length;
    const absentCount = studentRecords.filter(
      (record) => record.status === "Absent"
    ).length;
    return { presentCount, absentCount };
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Monthly Attendance Report for ${month}`, 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [["Roll#", "Name", "Class", "Present Days", "Absent Days"]],
      body: students.map((student) => {
        const { presentCount, absentCount } = getAttendanceCount(student.id);
        return [
          student.studentId,
          student.student_name,
          student.class,
          student.present,
          student.absent,
        ];
      }),
    });

    doc.save(`monthly_attendance_report_${month}.pdf`);
  };

  return (
    // <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    //   {/* Header */}
    //   <div className="flex flex-col md:flex-row items-center justify-between mb-4">
    //     <h1 className="text-lg font-semibold">
    //       Monthly Attendance Report for {month}
    //     </h1>

    //     {/* Add date inputs */}
    //     <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mb-4">
    //       {/* Add the class and section selectors */}
    //     </div>

    //     <div className="flex gap-4">
    //       <button
    //         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    //         onClick={() => router.push("/list/attendance")}
    //       >
    //         Mark Attendance
    //       </button>
    //       <button
    //         className="px-4 py-2 bg-red-400 text-white rounded-lg"
    //         onClick={handleExportPDF}
    //       >
    //         Export to PDF
    //       </button>
    //     </div>
    //   </div>

    //   <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mb-4">
    //     <div className="flex gap-4">
    //       <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
    //         <input
    //           type="date"
    //           value={startDate}
    //           onChange={(e) => setStartDate(e.target.value)}
    //           className="p-2 bg-transparent active:outline-none outline-none"
    //         />
    //       </div>
    //       <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
    //         <input
    //           type="date"
    //           value={endDate}
    //           onChange={(e) => setEndDate(e.target.value)}
    //           className="p-2 bg-transparent active:outline-none outline-none"
    //         />
    //       </div>
    //     </div>

    //     <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mb-4">
    //       <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
    //         <Image src="/search.png" alt="" width={14} height={14} />
    //         <select
    //           className="lg:w-[200px] w-full p-2 bg-transparent active:outline-none outline-none"
    //           value={selectedClass}
    //           onChange={handleClassChange}
    //         >
    //           <option value="">Select Class</option>
    //           {classesData.data?.map((classItem) => (
    //             <option key={classItem.id} value={classItem.id}>
    //               {classItem.name}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
    //         <Image src="/search.png" alt="" width={14} height={14} />
    //         <select
    //           className="lg:w-[200px] w-full p-2 bg-transparent active:outline-none outline-none"
    //           value={selectedSection}
    //           onChange={handleSectionChange}
    //         >
    //           <option value="">Select Section</option>
    //           {section?.map((sectionItem) => (
    //             <option key={sectionItem.id} value={sectionItem.id}>
    //               {sectionItem.name}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //     </div>
    //   </div>
    //   {/* Show message if no section selected */}
    //   {!selectedSection ? (
    //     <div className="text-center p-4">Please select a section first</div>
    //   ) : (
    //     /* Table */
    //     <table className="w-full text-sm">
    //       <thead>
    //         <tr className="border-b border-gray-200 bg-gray-100 text-left">
    //           <th className="p-4">Info</th>
    //           <th className="p-4 hidden md:table-cell">Student ID</th>
    //           <th className="p-4 hidden md:table-cell">Class</th>
    //           <th className="p-4 hidden md:table-cell">Present Days</th>
    //           <th className="p-4 hidden md:table-cell">Absent Days</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {students.map((student) => {
    //           const { presentCount, absentCount } = getAttendanceCount(
    //             student.id
    //           );
    //           return (
    //             <tr
    //               key={student.id}
    //               className="border-b border-gray-200 even:bg-slate-50 hover:bg-lamaPurpleLight"
    //             >
    //               <td className="flex items-center gap-4 p-4">
    //                 {/* <Image
    //                   src={student.photo}
    //                   alt=""
    //                   width={40}
    //                   height={40}
    //                   className="w-10 h-10 rounded-full object-cover"
    //                 /> */}
    //                 <div>
    //                   <h3 className="font-semibold">{student.student_name}</h3>
    //                   <p className="text-xs text-gray-500">{student.class}</p>
    //                 </div>
    //               </td>
    //               <td className="p-4 hidden md:table-cell">
    //                 {student.student_id}
    //               </td>
    //               <td className="p-4 hidden md:table-cell">{student.class}</td>
    //               <td className="p-4 hidden md:table-cell">
    //                 {student.present}
    //               </td>
    //               <td className="p-4 hidden md:table-cell">{student.absent}</td>
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>
    //   )}
    // </div>
    <>Admin Attendance</>
  );
};

export default AttendanceReport;
