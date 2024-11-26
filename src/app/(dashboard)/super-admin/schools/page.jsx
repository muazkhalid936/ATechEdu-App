"use client";
import { useState, useEffect } from "react";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import TableSearch from "../../../../components/TableSearch";
import { role } from "../../../../lib/data";
import api from "../../../../components/axios";
import Image from "next/image";
import SchoolStatusToggle from '../../../../components/SchoolStatusToggle';

const columns = [
  {
    header: "ID",
    accessor: "id",
  },
  {
    header: "School Name",
    accessor: "name",
  },
  {
    header: "Contact Info",
    accessor: "contact_info",
    className: "hidden md:table-cell",
  },
  {
    header: "Location",
    accessor: "address",
    className: "hidden lg:table-cell",
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

const dummySchoolData = {
  data: {
    listing: [
      {
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Springfield Elementary",
        logo: "/logo.png",
        email: "admin@springfield.edu",
        contact_number: "(555) 123-4567",
        address: "123 School Lane",
        city: "Springfield",
        state: "IL",
        country: "United States",
        postal_code: "62701",
        admin_id: "admin_001",
        student_count: 850,
        teacher_count: 45,
        parent_count: 1200,
        created_at: "2023-01-15T08:30:00Z",
        updated_at: "2024-03-20T14:25:00Z",
        status: "Active",
        subscription_plan: "Premium",
        subscription_expiry: "2025-01-14",
        customizations: {
          theme: "blue",
          modules: ["attendance", "grades", "library"],
          features: ["advanced_analytics", "parent_portal"]
        }
      },
      {
        school_id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Central High School",
        logo: "/logo.png",
        email: "admin@centralhigh.edu",
        contact_number: "(555) 987-6543",
        address: "456 Education Ave",
        city: "Central City",
        state: "NY",
        country: "United States",
        postal_code: "10001",
        admin_id: "admin_002",
        student_count: 1200,
        teacher_count: 75,
        parent_count: 1800,
        created_at: "2023-03-20T09:15:00Z",
        updated_at: "2024-03-19T16:45:00Z",
        status: "Active",
        subscription_plan: "Enterprise",
        subscription_expiry: "2025-03-19",
        customizations: {
          theme: "green",
          modules: ["attendance", "grades", "library", "sports"],
          features: ["advanced_analytics", "parent_portal", "bus_tracking"]
        }
      },
      {
        school_id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Westview Academy",
        logo: "/logo.png",
        email: "admin@westview.edu",
        contact_number: "(555) 246-8135",
        address: "789 Learning Blvd",
        city: "Portland",
        state: "OR",
        country: "United States",
        postal_code: "97201",
        admin_id: "admin_003",
        student_count: 600,
        teacher_count: 35,
        parent_count: 950,
        created_at: "2023-06-10T10:20:00Z",
        updated_at: "2024-03-18T11:30:00Z",
        status: "Active",
        subscription_plan: "Standard",
        subscription_expiry: "2024-12-31",
        customizations: {
          theme: "purple",
          modules: ["attendance", "grades"],
          features: ["basic_analytics"]
        }
      },
      {
        school_id: "550e8400-e29b-41d4-a716-446655440003",
        name: "International Prep School",
        logo: "/logo.png",
        email: "admin@intprep.edu",
        contact_number: "(555) 369-1470",
        address: "101 Global Way",
        city: "Miami",
        state: "FL",
        country: "United States",
        postal_code: "33101",
        admin_id: "admin_004",
        student_count: 450,
        teacher_count: 40,
        parent_count: 700,
        created_at: "2023-09-05T11:45:00Z",
        updated_at: "2024-03-15T09:20:00Z",
        status: "Inactive",
        subscription_plan: "Premium",
        subscription_expiry: "2024-09-04",
        customizations: {
          theme: "orange",
          modules: ["attendance", "grades", "library", "international_curriculum"],
          features: ["advanced_analytics", "parent_portal", "language_support"]
        }
      }
    ],
    totalPages: 1
  }
};

const SchoolListPage = () => {
  const [schoolsData, setSchoolsData] = useState(dummySchoolData);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchSchools = async (page, search) => {
    try {
      setLoading(true);
      const response = await api.get("/schools", {
        params: {
          page,
          limit: pageSize,
          search
        }
      });
      
      setSchoolsData(response.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const nameSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td>{item.id}</td>
      <td className="flex items-center gap-4 p-4">
        {/* {item.logo && (
          <Image
            src={item.logo}
            alt={item.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )} */}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <span className="text-gray-500 text-xs">{item.email}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div>
          <div className="text-xs text-gray-500">{item.email}</div>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div>{item.address}</div>
      </td>
      <td>
        <SchoolStatusToggle initialStatus={item.isActive} schoolId={item.id} />
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="school" type="update" data={item} />
              <FormModal table="school" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Schools</h1>
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
            {(role === "admin" || role === "super_admin") && (
              <FormModal table="school" type="create" />
            )}
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
          data={schoolsData.data?.listing || []}
        />
      )}
      {/* PAGINATION */}
      <Pagination
        currentPage={schoolsData.data?.currentPage || 0}
        totalPages={schoolsData.data?.totalPages || 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SchoolListPage;
