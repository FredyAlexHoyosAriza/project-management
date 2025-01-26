"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/graphql/queries/getUsers";
import { User } from "@/types/user";

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const { data, loading, error } = useQuery(GET_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const users = data?.getUsers || initialUsers;

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(({ _id, name, surname, email }: User) => (
          <li key={_id}>
            {name} {surname} - email: {email}
          </li>
        ))}
      </ul>
    </div>
  );
}
