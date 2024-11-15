"use client";
import React, { useState, useEffect } from "react";
import api from "../../../../components/axios";
import ReactQuillEditor from "../../../../components/ReactQuillEditor";
const page = () => {
  const [section, setSection] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/sections");
        setSection(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLogin(false);
      }
    };
    fetchSections();
  }, []);
  console.log(section, "Section");
  return (
    <div className="mx-2 rounded-lg p-4 bg-white">
      <ReactQuillEditor />
    </div>
  );
};

export default page;
