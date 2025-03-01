'use client';

import { useAuth } from '@/context/AuthProvider';

const PrivateComponent = ({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) => {
  const { userRole } = useAuth();

  // Si el usuario no esta definido o no tiene permiso, no se muestra nada
  if (!userRole || !roles.includes(userRole)) return null; // Oculta el contenido si el usuario no tiene permiso  

  return children;
};

export default PrivateComponent;
