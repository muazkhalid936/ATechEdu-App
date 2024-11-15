"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useUserStore } from "../../store/useUserStore";
const AuthCheck = () => {
  const { setIsLogin, setRole, setFirstName, setLastName } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    setFirstName(firstName);
    setLastName(lastName);

    if (!token) {
      router.push("/sign-in");
    } else {
      setIsLogin(true);
      setRole(role);
    }
    setLoading(false);
  }, [router, setIsLogin, setRole]);

  if (loading == true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }
};

export default AuthCheck;
