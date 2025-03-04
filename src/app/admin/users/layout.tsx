import React, { ReactNode } from "react";
import { UserEditingProvider } from "@/context/UserEditingProvider";
import PrivateRoute from "@/components/PrivateRoute";
import AuthorizedRoute from "@/components/AuthorizedRoute";

// Layout de Usuario
const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthorizedRoute>
      <PrivateRoute roles={["MANAGER", "LEADER"]}>
        <UserEditingProvider>{children}</UserEditingProvider>
      </PrivateRoute>
    </AuthorizedRoute>
  );
};

export default UserLayout;
