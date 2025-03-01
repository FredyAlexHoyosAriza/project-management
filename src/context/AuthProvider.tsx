"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@auth0/nextjs-auth0";// EN CLIENT ES ASÍ
import { customJwtPayload } from "@/types/user";

const AuthContext = createContext<{ userRole: string | null }>({
  userRole: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
    const token = await getAccessToken();
      if (token) {
        const role = jwtDecode<customJwtPayload>(token)["http://localhost/userInfo"].role;
        setUserRole(role);
      }
    };
    getUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
