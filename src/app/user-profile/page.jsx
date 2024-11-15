"use client";
import api from "../../components/axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/useUserStore";
import { GoArrowLeft } from "react-icons/go";

import ClipLoader from "react-spinners/ClipLoader";
import ProfileModal from "./ProfileModal";

const ProfilePage = () => {
  const { role } = useUserStore();
  console.log(role);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching data");
        const res = await api.get("/user/data");
        console.log(res);
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      const res = await api.get("/user/data");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );

  return (
    <div className="flex justify-center  items-center h-screen overflow-y-scroll bg-gray-100">
      <div className="p-6 bg-white w-[90%] lg:w-2/3 rounded-lg shadow-lg h-screen overflow-y-scroll">
        <div className="flex  top-5 left-5 items-center gap-2">
          <GoArrowLeft
            className="text-2xl cursor-pointer"
            onClick={() => router.back()}
          />
        </div>
        <h1 className="text-2xl text-center font-bold mb-4">Profile Details</h1>

        <div className="space-y-6">
          <div className="flex items-center border-t border-gray-200 pt-5 justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Profile</div>
              <div className="flex items-center space-x-4">
                <Image
                  src={data.avatar || "/avatar.png"}
                  alt="Profile avatar"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <p className="text-lg font-semibold">
                  {data.first_name} {data.last_name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>First Name</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg ">{data.first_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Last Name</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg ">{data.last_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Username</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg">{data.username}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Email</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg">{data.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Phone</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg ">{data.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center border-b border-gray-200 pb-5 w-full">
              <div>Status</div>
              <div className="flex items-center space-x-4">
                <p className="text-lg ">
                  {data.status ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 mt-4 bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Edit profile
          </button>
        </div>

        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={data}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
