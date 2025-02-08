'use client';
import { User } from "@/types/user";
import { createContext, useState, useContext, ReactNode } from "react";

// Definir el tipo del contexto con shouldGetUsers y su setter
interface UserContextType {
  userData: User | null;
  setUserData: (data: User) => void;
  shouldGetUsers: boolean;
  setShouldGetUsers: (value: boolean) => void;
}

// Crear el contexto con un valor inicial
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Definir las props del UserEditingProvider
interface UserProviderProps {
  children: ReactNode;
}

// Crear el UserEditingProvider con el nuevo estado
export const UserEditingProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [shouldGetUsers, setShouldGetUsers] = useState(false);

  return (
    <UserContext.Provider value={{ userData, setUserData, shouldGetUsers, setShouldGetUsers }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario con seguridad de tipo
export const useUserEditing = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserEditing must be used within a UserEditingProvider");
  }
  return context;
};

