import React, { ReactNode } from "react";
import { UserEditingProvider } from "@/context/UserEditingProvider";
import PrivateRoute from "@/components/PrivateRoute";

// Layout de Usuario
const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrivateRoute roles={["MANAGER", "LEADER"]}>
      <UserEditingProvider>{children}</UserEditingProvider>
    </PrivateRoute>
  );
};

export default UserLayout;
