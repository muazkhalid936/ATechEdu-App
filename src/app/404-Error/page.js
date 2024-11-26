"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ErrorPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[120px] font-black text-red-500 m-0">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Oops! Page Not Found
      </h2>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <button 
        onClick={() => router.push("/")}
        className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg 
                 hover:bg-blue-600 transition-colors duration-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go to Homepage
      </button>
      <p className="mt-6 text-gray-400 text-sm">
        You will be redirected to homepage in <span className="font-medium">{countdown}</span> seconds...
      </p>
    </div>
  );
}
