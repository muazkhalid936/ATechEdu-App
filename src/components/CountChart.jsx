"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from './axios'

const CountChart = () => {
  const [chartData, setChartData] = useState([
    {
      name: "Total",
      count: 0,
      fill: "white",
    },
    {
      name: "Girls",
      count: 0,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: 0,
      fill: "#C3EBFA",
    },
  ]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get("/students");
      const students = res.data.data.listing;
      
      const maleCount = students.filter(student => student.gender === "male").length;
      const femaleCount = students.filter(student => student.gender === "female").length;
      const totalCount = maleCount + femaleCount;
      
      setChartData([
        {
          name: "Total",
          count: totalCount,
          fill: "white",
        },
        {
          name: "Girls",
          count: femaleCount,
          fill: "#FAE27C",
        },
        {
          name: "Boys",
          count: maleCount,
          fill: "#C3EBFA",
        },
      ]);
    };
    fetchStudents();
  }, []);
 
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={chartData}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{chartData[2].count}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((chartData[2].count / chartData[0].count) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{chartData[1].count}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((chartData[1].count / chartData[0].count) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
