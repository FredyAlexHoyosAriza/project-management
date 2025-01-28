'use client';
// import UserForm from '@/components/users/UserForm';
// import UserList from '@/components/users/UserList';
import { User } from '@/types/user';
import Loading from '@/components/Loading';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/user/queries';
import UserTable from '@/components/users/UserTable';

export default function ManageUsers({ initialUsers }: { initialUsers: User[] }) {

  // Estado para disparar la actualización de la tabla
  const [shouldGetUsers, setShouldGetUsers] = useState(false);
  // Estado local para manejar los usuarios
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Hook para obtener los usuarios desde el servidor
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
    skip: true, // Evita que la query se ejecute automáticamente al montar el componente
  });
  // Actualización de usuarios cuando cambia `shouldGetUsers`
  React.useEffect(() => {
    if (shouldGetUsers) {
      refetch()
        .then(() => {
          if (data) {
            setUsers(data.getUsers);
            toast.success('Tabla actualizada con éxito!!!');
          } else {
            toast.error('La tabla no pudo ser actualizada');
          }
        })
        .catch(() => {
          console.error(error);
          toast.error('Ocurrió un error al actualizar los usuarios:');
        })
        .finally(() => {
          setShouldGetUsers(false); // Restablece el estado para evitar múltiples llamadas
        });
    }
  }, [shouldGetUsers, data, error, refetch]);

  return (
    <div>
      <h2 className="mx-auto text-xl sm:text-3xl text-center font-bold text-slate-950 my-2">
        Administración de usuarios
      </h2>
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loading />
        </div>
      ) : (
        <UserTable listaUsuarios={users} setShouldGetUsers={setShouldGetUsers} />
      )}
    </div>
  );
}
