"use client";

import { usePathname } from 'next/navigation';

const useActiveRoute = (ruta: string): boolean => {
  const pathname = usePathname(); // Obtén la ruta actual

  // Verifica si pathname está definido antes de usarlo
  if (!pathname) {
    return false; // Si no hay pathname, la ruta no está activa
  }

  // Verifica si la ruta está activa
  if (ruta === '') {
    // Si la ruta es una cadena vacía, verifica si estamos en /admin
    return pathname === '/admin';
  }
  // Verifica si la ruta actual contiene la ruta dada
  return pathname.startsWith(`/admin/${ruta}`);
};

export default useActiveRoute;
