'use client';
import { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/user/queries';
import UserTable from '@/components/users/UserTable';
import { useUser } from '@/context/UserProvider';
import { RingLoader } from 'react-spinners';

export default function ManageUsers({ initialUsers }: { initialUsers: User[] }) {

  // Contexto para disparar la actualización de la tabla
  const { shouldGetUsers, setShouldGetUsers } = useUser(); // Usa el contexto

  // Estado local para manejar los usuarios
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Hook para obtener los usuarios desde el servidor
  const { loading, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
    skip: true, // Evita que la query se ejecute automáticamente al montar el componente
  });
  // Actualización de usuarios cuando cambia `shouldGetUsers`
  useEffect(() => {
    if (shouldGetUsers) {
      refetch()
        .then(({ data }) => {
          if (data) {
            setUsers(data.getUsers);
            toast.success('Lista actualizada con éxito!!!');
          } else {
            toast.error('La lista no pudo ser actualizada');
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error('Ocurrió un error al actualizar los usuarios:');
        })
        .finally(() => {
          setShouldGetUsers(false); // Restablece el estado para evitar múltiples llamadas
        });
    }
  }, [shouldGetUsers, setShouldGetUsers, refetch]);

  return (
    <div>
      <h2 className="mx-auto text-xl sm:text-3xl text-center font-bold text-slate-950 my-2">
        Administración de usuarios
      </h2>
      {loading ? (
        <div className="w-full h-full grid place-items-center box-content mt-16">
          <RingLoader color='white' size={100} />
        </div>
      ) : (
        <UserTable listaUsuarios={users} />
      )}
    </div>
  );
}
