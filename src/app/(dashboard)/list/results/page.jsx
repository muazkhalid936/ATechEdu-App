"use client";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import TableSearch from "../../../../components/TableSearch";
import { resultsData, role } from "../../../../lib/data";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "../../../../components/axios";

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  // {
  //   header: "Teacher",
  //   accessor: "teacher",
  //   className: "hidden md:table-cell",
  // },
  {
    header: "Full Marks",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Section",
    accessor: "section",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ResultListPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");

  const fetchResults = async () => {
    try {
      const response = await api.get("/results");
      console.log(response.data.data.results, "results");
      setDate(response.data.data.results[0].updatedAT);
      setResults(response.data.data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    console.log(results, "results");
    console.log(date, "date");
  }, []);

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject || "N/A"}</td>
      <td>
        {item.student?.user?.first_name + " " + item.student?.user?.last_name ||
          "N/A"}
      </td>
      <td className="hidden md:table-cell">{item.marks_obtained || "N/A"}</td>
      <td className="hidden md:table-cell">{item.total_marks || "N/A"}</td>
      <td className="hidden md:table-cell">{item.section.name || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormModal table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lamaPurple"></div>
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={results} />
      )}
      {/* PAGINATION */}
      {!isLoading && <Pagination />}
    </div>
  );
};

export default ResultListPage;
