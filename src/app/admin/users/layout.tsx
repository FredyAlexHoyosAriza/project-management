import React, { ReactNode } from "react";
import { UserProvider } from "@/context/UserProvider";

// Layout de Usuario
const UserLayout = ({ children }: { children: ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default UserLayout;
