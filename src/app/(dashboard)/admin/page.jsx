"use client";
import UserCard from "../../../components/UserCard";
import api from "../../../components/axios";
import AttendanceChart from "../../../components/AttendanceChart";
import CountChart from "../../../components/CountChart";
import FinanceChart from "../../../components/FinanceChart";
import { useEffect, useState } from "react";
import EventCalendar from "../../../components/EventCalendar";
import Announcements from "../../../components/Announcements";
import { useUserStore } from "../../../store/useUserStore";
const AdminPage = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/students");
        setStudentCount(response.data.data.totalItems);
        const response2 = await api.get("/teachers");
        setTeacherCount(response2.data.data.totalItems);
        const response3 = await api.get("/parents");
        setParentCount(response3.data.data.totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const { role } = useUserStore();
  if (role === "admin" || role === "super_admin") {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    return (
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="student" count={studentCount} />
            <UserCard type="teacher" count={teacherCount} />
            <UserCard type="parent" count={parentCount} />
          </div>
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* <EventCalendar /> */}
          {/* <Announcements /> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        You are not authorized to access this page
      </div>
    );
  }
};

export default AdminPage;
