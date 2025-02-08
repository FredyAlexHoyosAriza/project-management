import React, { ReactNode } from "react";
import SideBar from "@/components/SideBar";
import { ToastContainer } from "react-toastify";

// Layout para la sección de administración
export function AdminLayout ({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-screen h-screen md:flex-row">
      <SideBar />
      <main className="flex-grow flex items-start justify-end md:justify-center w-screen h-auto p-4 bg-blue-400 overflow-y-auto">
        {children}
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      </main>
    </div>
  );
};

export default AdminLayout;
