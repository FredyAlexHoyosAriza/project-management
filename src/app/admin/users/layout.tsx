import React, { ReactNode } from "react";
import { UserEditingProvider } from "@/context/UserEditingProvider";

// Layout de Usuario
const UserLayout = ({ children }: { children: ReactNode }) => {
  return <UserEditingProvider>{children}</UserEditingProvider>;
};

export default UserLayout;
