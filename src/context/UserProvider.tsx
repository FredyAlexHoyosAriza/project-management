'use client';
import { User } from "@/types/user";
import { createContext, useState, useContext, ReactNode } from "react";

// Definir el tipo del contexto
interface UserContextType {
  userData: User | null;
  setUserData: (data: User) => void;
}

// Crear el contexto con un valor inicial
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Definir las props del UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Crear el UserProvider
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<User | null>(null); // Corregido el tipado

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario con seguridad de tipo
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
