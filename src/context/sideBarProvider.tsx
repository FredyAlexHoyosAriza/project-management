'use client';
import { createContext, useState, useContext, ReactNode } from "react";

// Definir el tipo del contexto con shouldGetUsers y su setter
interface SideBarContextType {
  shouldShowSideBar: boolean;
  setShouldShowSideBar: (value: boolean) => void;
}

// Crear el contexto con un valor inicial
export const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

// Definir las props del SideBarProvider
interface SideBarProviderProps {
  children: ReactNode;
}

// Crear el SideBarProvider con el nuevo estado
export const SideBarProvider = ({ children }: SideBarProviderProps) => {
  const [shouldShowSideBar, setShouldShowSideBar] = useState(true);

  return (
    <SideBarContext.Provider value={{ shouldShowSideBar, setShouldShowSideBar }}>
      {children}
    </SideBarContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de sidebar con seguridad de tipo
export const useShowSideBar = (): SideBarContextType => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useShowSideBar must be used within a SideBarProvider");
  }
  return context;
};