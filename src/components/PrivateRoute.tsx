"use client";
import { useAuth } from "@/context/AuthProvider";
import { redirect } from "next/navigation";
import React from "react";
import Loading from "./Loading";

const PrivateRoute = ({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) => {
  const { userInfo } = useAuth();
  if (!userInfo) return <Loading />; // Evita que la página se renderice sin datos
  if (!roles.includes(userInfo.role)) {
    redirect("/admin"); // Redirige si el usuario no tiene permisos
  }
  return children;
};

export default PrivateRoute;
