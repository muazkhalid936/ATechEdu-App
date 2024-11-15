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
        router.push("/admin");
      } else {
        router.push(`/${role}`);
      }
    } else {
      router.push("/sign-in");
    }

    setLoading(false);
  }, [router]);

  return <></>;
};

export default Homepage;
