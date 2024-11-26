"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "./axios";
const ResultForm = dynamic(() => import("./forms/ResultModal"), {
  loading: () => <h1>Loading...</h1>,
});

const SectionForm = dynamic(() => import("./forms/SectionForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const DiaryForm = dynamic(() => import("./forms/DiaryForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SchoolForm = dynamic(() => import("./forms/SchoolForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  section: (type, data) => <SectionForm type={type} data={data} />,
  result: (type, data) => <ResultForm type={type} data={data} />,
  diary: (type, data) => <DiaryForm type={type} data={data} />,
  school: (type, data) => <SchoolForm type={type} data={data} />,
};
const handleDelete = async (table, id) => {
  let userID = id;

  try {
    if (table === "class") {
      const res = await api.delete(`/classes/${userID}`);
    } else if (table === "diary") {
      const res = await api.delete(`/diaries/${userID}`);
    } else {
      const res = await api.delete(`/${table}s/${userID}`);
    }

    toast.success("Deleted successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    toast.error(error.response.data.message);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};
const FormModal = ({ table, type, data, id }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form
          action=""
          className="p-4 flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button
            onClick={async (e) => {
              e.preventDefault();
              await handleDelete(table, id);
              setOpen(false);
            }}
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
          >
            Delete
          </button>
        </form>
      );
    } else if ((type === "create" || type === "update") && forms[table]) {
      return forms[table](type, data);
    } else {
      return <span>Form not found!</span>;
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60  z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
