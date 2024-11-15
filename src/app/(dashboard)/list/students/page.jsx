"use client";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import { role } from "../../../../lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../../components/axios";

const columns = [
  {
    header: "User ID",
    accessor: "id",
  },
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentListPage = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchStudents = async (page, search) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/students?page=${page}&size=${pageSize}&search=${search}`
      );
      setStudentsData(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const nameSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td>
        {item.id}
      </td>
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.user.first_name} {item.user.last_name}
          </h3>
          <p className="text-xs text-gray-500">{item.user.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.student_id}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.user.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="student" type="update" data={item} />
              <FormModal table="student" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => nameSearch(e)}
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table
          columns={columns}
          renderRow={renderRow}
          data={studentsData.data.listing.sort((a, b) => a.id - b.id)}
        />
      )}
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={studentsData.data?.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default StudentListPage;