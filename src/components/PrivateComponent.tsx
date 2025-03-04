'use client';

import { useAuth } from '@/context/AuthProvider';

const PrivateComponent = ({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) => {
  const { userInfo } = useAuth();

  // Si el usuario no esta definido o no tiene permiso, no se muestra nada
  if (!userInfo || !roles.includes(userInfo.role)) return null; // Oculta el contenido si el usuario no tiene permiso  

  return children;
};

export default PrivateComponent;
