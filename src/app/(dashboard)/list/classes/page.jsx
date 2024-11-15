"use client";
import { useState, useEffect } from "react";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import TableSearch from "../../../../components/TableSearch";
import { classesData, role } from "../../../../lib/data";
import Image from "next/image";
import api from "../../../../components/axios";

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  // {
  //   header: "Capacity",
  //   accessor: "capacity",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Grade",
  //   accessor: "grade",
  //   className: "hidden md:table-cell",
  // },
  // {
  //   header: "Supervisor",
  //   accessor: "supervisor",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Session",
    accessor: "session",
  },
  {
    header: "Description",
    accessor: "description",
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

const ClassListPage = () => {
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchClasses = async (search) => {
    try {
      setLoading(true);
      console.log(search);
      const response = await api.get(`/classes?academic_year=${search}`);
      setClassesData(response.data);
      console.log(response.data,"asd");
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(searchQuery);
  }, [currentPage, searchQuery]);

  const nameSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.academic_year}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell">{item.status ? "Active" : "Inactive"}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "super_admin" && (
            <>
              <FormModal table="class" type="update" data={item} />
              <FormModal table="class" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
            {role === "admin" && <FormModal table="class" type="create" />}
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
          data={classesData.data}
        />
      )}
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={classesData.data?.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ClassListPage;
