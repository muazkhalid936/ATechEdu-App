"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
const Homepage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "super_admin") {
        router.push("/super-admin");
      } else {
        router.push(`/${role}`);
      }
    } else {
      router.push("/sign-in");
    }

    setLoading(false);
  }, [router]);

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lamaPurple"></div>
    </div>
  ) : (
    <></>
  );
};

export default Homepage;
