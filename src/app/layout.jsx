import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import AuthCheck from "../components/Auth/AuthCheck";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ATechEdu Management System",
  description: "Next.js School Management System",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheck />
        {children}
        <ToastContainer autoClose={2000} />
      </body>
    </html>
  );
}
