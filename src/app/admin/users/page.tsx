import { fetchUsers } from "@/services/userService";
import { User } from "@/types/user";

import ManageUsers from "@/components/users/ManageUsers";
import { auth0 } from "@/lib/auth0";

export default async function Users() {
  // console.log('Soy Alex y soy un ganador')
  const session = await auth0.getSession();
  const users: User[] = session ? await fetchUsers() : [];
  return (
    <div>
      {/* <h1>Gestión de Usuarios</h1> */}
      <ManageUsers initialUsers={users} />
    </div>
  );
}
