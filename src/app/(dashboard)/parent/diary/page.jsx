"use client";
import React, { useState, useEffect } from "react";
import api from "../../../../components/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Table from "../../../../components/Table";
import FormModal from "../../../../components/FormModal";

import { useUserStore } from "../../../../store/useUserStore";
import { toast } from "react-toastify";
import Image from "next/image";
import Pagination from '../../../../components/Pagination';

const page = () => {
  const { role } = useUserStore();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [value, setValue] = useState("");
  const [diary, setDiary] = useState([]);
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },

    {
      header: "Submission Date",
      accessor: "submission_date",
    },
    {
      header: "Homework",
      accessor: "homework",
    },
    {
      header: "Remarks",
      accessor: "remarks",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td className="hidden md:table-cell">{item.submission_date}</td>
      <td
        className="hidden md:table-cell"
        dangerouslySetInnerHTML={{ __html: item.homework }}
      />
      <td
        className="hidden md:table-cell"
        dangerouslySetInnerHTML={{ __html: item.remarks }}
      />
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "super_admin" && (
              <>
                <FormModal table="diary" type="update" data={item} />
                <FormModal table="diary" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  const fetchDiary = async (search = "") => {
    try {
      const response = await api.get(
        `/diaries?page=${currentPage}&size=${pageSize}${
          search ? `&search=${search}` : ""
        }`
      );
      setDiary(response.data.data.listing);
      setTotalPages(Math.ceil(response.data.data.total / pageSize));
    } catch (error) {
      console.error("Error fetching diary:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsResponse, diaryResponse] = await Promise.all([
          api.get("/sections"),
          api.get(`/diaries?page=${currentPage}&size=${pageSize}`),
        ]);
        setSections(sectionsResponse.data.data);
        setDiary(diaryResponse.data.data.listing);
        setTotalPages(Math.ceil(diaryResponse.data.data.total / pageSize));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLogin(false);
      }
    };
    fetchData();
  }, [currentPage]);

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
      remarks: note,
      submission_date: submissionDate,
    };
    try {
      console.log("diaryEntry", diaryEntry);
      const response = await api.post("/diaries", diaryEntry);
      toast.success("Diary entry saved successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // if (role !== "student") {
  //   return (
  //     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
  //       <div className="flex items-center justify-between">
  //         <h1 className="hidden md:block text-lg font-semibold">
  //           Diary Entries
  //         </h1>
  //         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
  //           <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
  //             <Image src="/search.png" alt="" width={14} height={14} />
  //             <input
  //               type="text"
  //               placeholder="Search..."
  //               className="w-[200px] p-2 bg-transparent outline-none"
  //               onChange={(e) => fetchDiary(e.target.value)}
  //             />
  //           </div>
  //           <div className="flex items-center gap-4 self-end">
  //             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
  //               <Image src="/filter.png" alt="" width={14} height={14} />
  //             </button>
  //             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
  //               <Image src="/sort.png" alt="" width={14} height={14} />
  //             </button>
  //             {role === "admin" ||
  //               (role === "super_admin" && (
  //                 <FormModal table="diary" type="create" />
  //               ))}
  //           </div>
  //         </div>
  //       </div>

  //       <Table columns={columns} renderRow={renderRow} data={diary} />

  //       <Pagination
  //         currentPage={currentPage}
  //         totalPages={totalPages}
  //         onPageChange={setCurrentPage}
  //       />
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
  //       <Table columns={columns} renderRow={renderRow} data={diary} />
  //       <Pagination
  //         currentPage={currentPage}
  //         totalPages={totalPages}
  //         onPageChange={setCurrentPage}
  //       />
  //     </div>
  //   );
  // }

  return <>Parent Diary</>
};

export default page;
