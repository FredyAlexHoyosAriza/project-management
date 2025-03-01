"use client";
import { User } from "@/types/user";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/graphql/user/queries";
import UserTable from "@/components/users/UserTable";
import { useUserEditing } from "@/context/UserEditingProvider";
import { RingLoader } from "react-spinners";

export default function ManageUsers({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const { shouldGetUsers, setShouldGetUsers } = useUserEditing();

  // Hook para obtener los usuarios
  const { data, loading, refetch } = useQuery(GET_USERS, {
    fetchPolicy: "cache-and-network",
    skip: initialUsers.length > 0, // Evita consulta doble si ya tenemos datos desde SSR
  });

  // Si hay datos nuevos en Apollo, los usamos; si no, usamos initialUsers de SSR
  const users = data?.getUsers || initialUsers || [];

  useEffect(() => {
    if (shouldGetUsers) {
      refetch()
        .then(({ data }) => {
          if (data?.getUsers) {
            toast.success("Lista actualizada con éxito!");
          } else {
            toast.error("No se pudo actualizar la lista.");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error al actualizar los usuarios.");
        })
        .finally(() => setShouldGetUsers(false));
    }
  }, [shouldGetUsers, setShouldGetUsers, refetch]);

  return (
    <div>
      <h2 className="mx-auto text-xl sm:text-3xl text-center font-bold text-slate-950 my-2">
        Administración de usuarios
      </h2>
      {loading && !initialUsers?.length ? (
        <Loading />
      ) : (
        <UserTable listaUsuarios={users} />
      )}
    </div>
  );
}

const Loading = () => {
  return (
    // Evita que la página se renderice sin datos
    <div className="w-full h-full grid place-items-center box-content mt-16">
      <RingLoader color="white" size={100} />
    </div>
  );
};
