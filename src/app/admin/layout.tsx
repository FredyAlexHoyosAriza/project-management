import React, { ReactNode } from "react";
import SideBar from "@/components/SideBar";

// Layout para la sección de administración
const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-screen h-screen md:flex-row">
      {/* Barra lateral fija */}
      <SideBar />
      {/* Contenido principal con desplazamiento */}
      <main className="flex-grow flex items-start justify-center w-screen h-auto p-4 bg-blue-400 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
