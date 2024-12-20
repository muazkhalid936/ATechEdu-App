"use client";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../..//components/Pagination";
import Table from "../../../..//components/Table";
import TableSearch from "../../../..//components/TableSearch";
import { role } from "../../../..//lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "../../../../components/axios";

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Subjects",
  //   accessor: "subjects",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Classes",
  //   accessor: "classes",
  //   className: "hidden md:table-cell",
  // },
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

const TeacherListPage = () => {
  const [teachersData, setTeachersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchTeachers = async (page, search) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/teachers?page=${page}&size=${pageSize}&search=${search}`
      );
      setTeachersData(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);
  const nameSearch = (e) => {
    setSearchQuery(e.target.value);
    // setCurrentPage(0);
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {/* <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        /> */}
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.user.first_name} {item.user.last_name}
          </h3>
          <p className="text-xs text-gray-500">{item?.user.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacher_id}</td>
      {/* <td className="hidden md:table-cell">{item.subjects.join(",")}</td> */}
      {/* <td className="hidden md:table-cell">{item.classes.join(",")}</td> */}
      <td className="hidden md:table-cell">{item.user.phone || "N/A"} </td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="teacher" type="update" data={item.id} />
              <FormModal table="teacher" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
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
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button> */}
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lamaPurple"></div>
        </div>
      ) : (
        <Table
          columns={columns}
          renderRow={renderRow}
          data={teachersData.data?.listing || []}
        />
      )}
      {/* PAGINATION */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={teachersData.data?.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TeacherListPage;
