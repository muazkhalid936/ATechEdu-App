"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import api from "../../components/axios";
import { useUserStore } from "../../store/useUserStore";

const LoginPage = () => {
  const { setIsLogin, setRole, role, isLogin, setFirstName, setLastName } =
    useUserStore();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [change, setChange] = useState(false);
  const isFormFilled = email.trim() !== "" && password.trim() !== "";
  const router = useRouter();
  useEffect(() => {
    if (isLogin) {
      router.push(`/${role}`);
    }
  }, [router]);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/signin", {
        email,
        password,
      });

      const { data } = response;

      toast.success("Login successful");
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("role", data.data.role);
      localStorage.setItem("id", data.data.id);
      localStorage.setItem("first_name", data.data.first_name);
      localStorage.setItem("last_name", data.data.last_name);
      setFirstName(data.data.first_name);
      setLastName(data.data.last_name);
      setRole(data.data.role);
      setIsLogin(true);
      if (data.data.role === "super_admin") {
        router.push(`/super-admin`);
      } else {
        router.push(`/${data.data.role}`);
      }
    } catch (error) {
      setChange(true);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading == true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  } else
    return (
      <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
        <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-md">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SchooLama Logo"
              width={24}
              height={24}
            />
            ATechEdu
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setChange(false);
                }}
                className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setChange(false);
                  setPassword(e.target.value);
                }}
                className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormFilled || change}
              className="bg-blue-500 disabled:bg-blue-300 text-white mt-4 rounded-md text-sm p-[10px] hover:bg-blue-600 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
};

export default LoginPage;
