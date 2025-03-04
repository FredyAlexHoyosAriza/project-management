"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@auth0/nextjs-auth0";// EN CLIENT ES ASÍ
import { CustomJwtPayload, USER_INFO_KEY, UserInfo } from "@/types/user";

const AuthContext = createContext<{userInfo: UserInfo | null}>({
  userInfo: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const user = jwtDecode<CustomJwtPayload>(token)[USER_INFO_KEY];
          if (!user) throw new Error("User info not found in token");
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
