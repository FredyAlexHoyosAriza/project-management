"use client";
import { useAuth } from "@/context/AuthProvider";
import React from "react";

const AuthorizedComponent = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAuth();

  // Si el usuario no esta definido o no tiene permiso, no se muestra nada
  if (!userInfo || userInfo.state !== "AUTHORIZED") return null; // Oculta el contenido si el usuario no tiene permiso
  return children;
};

export default AuthorizedComponent;
