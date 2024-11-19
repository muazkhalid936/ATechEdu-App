"use client";
// import { role } from "../lib/data";
import { useUserStore } from "../store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../components/axios";

const Menu = () => {
  const router = useRouter();
  const { role, setIsLogin } = useUserStore();

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/signout");
      console.log(response);
      if (response.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLogin(false);
        toast.success(response.data.message);
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/teacher.png",
          label: "Teachers",
          href: "/list/teachers",
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/student.png",
          label: "Students",
          href: "/list/students",
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/parent.png",
          label: "Parents",
          href: "/list/parents",
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: "/class.png",
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/class.png",
          label: "Section",
          href: "/list/section",
          visible: ["admin", "teacher", "super_admin"],
        },
        // {
        //   icon: "/lesson.png",
        //   label: "Lessons",
        //   href: "/list/lessons",
        //   visible: ["admin", "teacher"],
        // },
        {
          icon: "/exam.png",
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/assignment.png",
          label: "Diary",
          href: "/list/diary",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/result.png",
          label: "Results",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/attendance.png",
          label: "Attendance",
          href: "/list/attendance-report",
          visible: ["admin", "teacher", "super_admin"],
        },

        // {
        //   icon: "/calendar.png",
        //   label: "Events",
        //   href: "/list/events",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },

        {
          icon: FaRegFileAlt,
          label: "Test Editor",
          href: "/list/Editor",
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: CiImageOn,
          label: "Post",
          href: "/list/post",
          visible: ["admin", "teacher", "super_admin"],
        },

        // {
        //   icon: "/announcement.png",
        //   label: "Announcements",
        //   href: "/list/announcements",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/user-profile",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "#",
          onClick: handleLogout,
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
      ],
    },
  ];
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  {/* Conditionally render icon or image */}
                  {typeof item.icon === "string" ? (
                    <Link href={item.href}>
                      <Image src={item.icon} alt="" width={20} height={20} />
                    </Link>
                  ) : (
                    <Link href={item.href}>
                      <item.icon size={20} />
                    </Link>
                  )}
                  {/* If it's logout, handle onClick, otherwise use Link */}
                  {item.label === "Logout" ? (
                    <span
                      className="hidden lg:block cursor-pointer"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href} className="hidden lg:block">
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};
export default Menu;
