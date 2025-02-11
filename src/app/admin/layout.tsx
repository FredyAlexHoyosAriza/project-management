import React, { ReactNode } from "react";
import SideBar from "@/components/SideBar";
import { ToastContainer } from "react-toastify";

// Layout para la sección de administración
export default function Layout ({ children }: { children: ReactNode }) {
  return (// ml-auto w-[calc(100vw-10rem)]
    <div className="flex flex-col w-screen h-screen md:flex-row">
      <SideBar />
      <main className="flex-grow flex items-start justify-end md:justify-center sm:w-screen h-auto p-4 bg-blue-400 overflow-y-auto">
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

