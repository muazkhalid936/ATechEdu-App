"use client";
import { useState, useEffect } from "react";
import FormModal from "../../../../components/FormModal";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/Table";
import TableSearch from "../../../../components/TableSearch";
import { role } from "../../../../lib/data";
import Image from "next/image";

const columns = [
  {
    header: "Admin ID",
    accessor: "admin_id",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Contact Info",
    accessor: "contact_info",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    accessor: "role",
    className: "hidden lg:table-cell",
  },
  {
    header: "Last Login",
    accessor: "last_login",
    className: "hidden xl:table-cell",
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

const dummyAdminData = {
  data: {
    listing: [
      {
        admin_id: "a50e8400-e29b-41d4-a716-446655440001",
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@springfield.edu",
        contact_number: "(555) 123-4567",
        profile_picture: "/logo.png",
        role: "School Admin",
        permissions: {
          users: ["view", "create", "edit", "delete"],
          reports: ["view", "create"],
          settings: ["view", "edit"]
        },
        created_at: "2023-01-15T08:30:00Z",
        updated_at: "2024-03-20T14:25:00Z",
        last_login: "2024-03-21T09:15:00Z",
        status: "Active"
      },
      {
        admin_id: "b60e8400-e29b-41d4-a716-446655440002",
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.j@springfield.edu",
        contact_number: "(555) 234-5678",
        profile_picture: "/logo.png",
        role: "Sub Admin",
        permissions: {
          users: ["view", "create"],
          reports: ["view"],
          settings: ["view"]
        },
        created_at: "2023-03-20T10:15:00Z",
        updated_at: "2024-03-19T16:30:00Z",
        last_login: "2024-03-20T08:45:00Z",
        status: "Active"
      },
      {
        admin_id: "c70e8400-e29b-41d4-a716-446655440003",
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "Michael",
        last_name: "Chen",
        email: "m.chen@springfield.edu",
        contact_number: "(555) 345-6789",
        profile_picture: "/logo.png",
        role: "IT Admin",
        permissions: {
          users: ["view", "create", "edit"],
          reports: ["view", "create", "edit"],
          settings: ["view", "edit"]
        },
        created_at: "2023-06-10T09:20:00Z",
        updated_at: "2024-03-18T11:45:00Z",
        last_login: "2024-03-19T14:30:00Z",
        status: "Suspended"
      },
      {
        admin_id: "d80e8400-e29b-41d4-a716-446655440004",
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "Emily",
        last_name: "Rodriguez",
        email: "e.rodriguez@springfield.edu",
        contact_number: "(555) 456-7890",
        profile_picture: "/logo.png",
        role: "Department Admin",
        permissions: {
          users: ["view", "create"],
          reports: ["view", "create"],
          settings: ["view"]
        },
        created_at: "2023-09-05T14:40:00Z",
        updated_at: "2024-03-17T09:20:00Z",
        last_login: "2024-03-21T10:15:00Z",
        status: "Active"
      },
      {
        admin_id: "e90e8400-e29b-41d4-a716-446655440005",
        school_id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "Robert",
        last_name: "Smith",
        email: "r.smith@springfield.edu",
        contact_number: "(555) 567-8901",
        profile_picture: "/logo.png",
        role: "Super Admin",
        permissions: {
          users: ["view", "create", "edit", "delete"],
          reports: ["view", "create", "edit", "delete"],
          settings: ["view", "edit", "delete"]
        },
        created_at: "2023-12-01T11:30:00Z",
        updated_at: "2024-03-16T15:50:00Z",
        last_login: "2024-03-20T16:45:00Z",
        status: "Active"
      }
    ],
    totalPages: 1
  }
};

const AdminListPage = () => {
  const [adminsData, setAdminsData] = useState(dummyAdminData);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const fetchAdmins = async (page, search) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter admins based on search query
      const filteredAdmins = dummyAdminData.data.listing.filter(admin =>
        admin.name.toLowerCase().includes(search.toLowerCase())
      );
      
      setAdminsData({
        data: {
          listing: filteredAdmins,
          totalPages: Math.ceil(filteredAdmins.length / pageSize)
        }
      });
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const nameSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRow = (item) => (
    <tr
      key={item.admin_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td>{item.admin_id.slice(0, 8)}...</td>
      <td className="flex items-center gap-4 p-4">
        {item.profile_picture && (
          <Image
            src={item.profile_picture}
            alt={`${item.first_name} ${item.last_name}`}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{`${item.first_name} ${item.last_name}`}</h3>
          <span className="text-gray-500 text-xs">{item.email}</span>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div>
          <div>{item.contact_number}</div>
          <div className="text-xs text-gray-500">{item.email}</div>
        </div>
      </td>
      <td className="hidden lg:table-cell">
        <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 inline-block">
          {item.role}
        </div>
      </td>
      <td className="hidden xl:table-cell">
        <div className="text-xs">
          {new Date(item.last_login).toLocaleDateString()}
        </div>
      </td>
      <td>
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="admin" type="update" data={item} />
              <FormModal table="admin" type="delete" id={item.admin_id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Admins</h1>
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
              <FormModal table="admin" type="create" />
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
          data={adminsData.data.listing.sort((a, b) => a.id - b.id)}
        />
      )}
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={adminsData.data?.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminListPage;
