import React, { ReactNode } from "react";
import Navbar from "@/components/NavBar";

export default function PublicLayout({ children }: { children: ReactNode}) {
  return (
    <div className="flex flex-col h-screen justify-around">
      <Navbar />
      <main className="h-screen overflow-y-scroll bg-blue-400">
        {children}
      </main>
    </div>
  );
}
