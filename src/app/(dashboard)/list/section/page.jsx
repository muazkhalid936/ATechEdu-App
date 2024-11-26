"use client";
import { useState, useEffect } from "react";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import { useUserStore } from "../../../../store/useUserStore";
import Image from "next/image";
import api from "../../../../components/axios";

const columns = [
  {
    header: "Section Name",
    accessor: "name",
  },
  // {
  //   header: "Capacity",
  //   accessor: "capacity",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Capacity",
    accessor: "section",
    className: "hidden md:table-cell",
  },
  {
    header: "Current Students",
    accessor: "section",
  },
  // {
  //   header: "Supervisor",
  //   accessor: "supervisor",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Class",
    accessor: "class",
    // className: "hidden md:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Description",
  //   accessor: "description",
  // },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ClassListPage = () => {
  const { role } = useUserStore();
  const [classesData, setClassesData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("all");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/classes`);
      setClassesData(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (classId) => {
    try {
      setLoading(true);
      console.log(classId);
      if (!classId) {
        const response = await api.get(`/sections`);
        setSectionData(response.data.data);
      } else {
        const response = await api.get(`/sections?class_id=${classId}`);
        setSectionData(response.data.data);
      }
      console.log(sectionData, "Section");
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  useEffect(() => {
    if (searchQuery && searchQuery !== "all") {
      fetchSections(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="">{item.student_count}</td>
      <td className="">{item.class.name}</td>
      <td className="hidden md:table-cell">
        {item.status ? "Active" : "Inactive"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "super_admin" && (
              <>
                <FormModal table="section" type="update" data={item} />
                <FormModal table="section" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Section List</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={14} height={14} />
            <select
              className="lg:w-[200px] w-full p-2 bg-transparent active:outline-none outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            >
              <option value="all" className="w-full">
                Select Class
              </option>
              {classesData.data?.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button> */}
            {role === "admin" ||
              (role === "super_admin" && (
                <FormModal table="section" type="create" data={classesData} />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lamaPurple"></div>
        </div>
      ) : sectionData.length === 0 ? (
        <div className="text-center py-4">No Section In Class</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={sectionData} />
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
