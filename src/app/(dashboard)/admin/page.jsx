'use client'
import UserCard from "../../../components/UserCard";

import AttendanceChart from "../../../components/AttendanceChart";
import CountChart from "../../../components/CountChart";
import FinanceChart from "../../../components/FinanceChart";
import EventCalendar from "../../../components/EventCalendar";
import Announcements from "../../../components/Announcements";
import { useUserStore } from "../../../store/useUserStore";
const AdminPage = () => {
  const { role } = useUserStore();
  if (role === "admin" || role === "super_admin") {
    return (
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="student" />
            <UserCard type="teacher" />
            <UserCard type="parent" />
            <UserCard type="staff" />
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
