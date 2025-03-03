"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@auth0/nextjs-auth0";// EN CLIENT ES ASÍ
import { customJwtPayload } from "@/types/user";

const AuthContext = createContext<{ userRole: string | null, userState: string | null }>({
  userRole: null,
  userState: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
    const token = await getAccessToken();
      if (token) {
        const decodedToken = jwtDecode<customJwtPayload>(token)["http://localhost/userInfo"];
        console.log('Token decodificado: ', decodedToken);
        const role = decodedToken.role;
        const state = decodedToken.state;
        setUserRole(role);
        setUserState(state);
      }
    };
    getUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, userState }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
