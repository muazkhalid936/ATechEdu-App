"use client";
// import { role } from "../lib/data";
import { useUserStore } from "../store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { FaRegFileAlt } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { LuSchool } from "react-icons/lu";
import { GrUserAdmin } from "react-icons/gr";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../components/axios";

const Menu = () => {
  const router = useRouter();
  let rl;
  const { role, setIsLogin } = useUserStore();
  if (role === "super_admin") {
    rl = "super-admin";
  }
  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/signout");
      console.log(response);
      if (response.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
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
          label: "Dashboard",
          href: "/",
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: LuSchool,
          label: "Schools",
          href: `/${rl}/schools`,
          visible: ["super_admin"],
        },
        {
          icon: GrUserAdmin,
          label: "Admin",
          href: `/${rl}/admins`,
          visible: ["super_admin"],
        },

        {
          icon: "/teacher.png",
          label: "Teachers",
          href: `/${role}/teachers`,
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/student.png",
          label: "Students",
          href: `/${role}/students`,
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/parent.png",
          label: "Parents",
          href: `/${role}/parents`,
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: `/${role}/subjects`,
          visible: ["admin"],
        },
        {
          icon: "/class.png",
          label: "Classes",
          href: `/${role}/classes`,
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: "/class.png",
          label: "Section",
          href: `/${role}/sections`,
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
          href: `/${role}/diary`,
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/result.png",
          label: "Results",
          
          href: `/${role}/results`,
          visible: ["admin", "teacher", "student", "parent", "super_admin"],
        },
        {
          icon: "/attendance.png",
          label: "Attendance",
          href: `/${role}/attendance-report`,
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
          href: `/${role}/Editor`,
          visible: ["admin", "teacher", "super_admin"],
        },
        {
          icon: CiImageOn,
          label: "Post",
          href: `/${role}/post`,
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
                  onClick={item.label === "Logout" ? item.onClick : undefined}
                >
                  {item.label === "Logout" ? (
                    <>
                      {typeof item.icon === "string" ? (
                        <Image src={item.icon} alt="" width={20} height={20} />
                      ) : (
                        <item.icon size={20} />
                      )}
                      <span className="hidden lg:block cursor-pointer">
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 w-full"
                    >
                      {typeof item.icon === "string" ? (
                        <Image src={item.icon} alt="" width={20} height={20} />
                      ) : (
                        <item.icon size={20} />
                      )}
                      <span className="hidden lg:block">{item.label}</span>
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
