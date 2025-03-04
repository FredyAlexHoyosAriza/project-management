import { fetchUsers } from "@/services/userService";
import { User } from "@/types/user";

import ManageUsers from "@/components/users/ManageUsers";

export default async function Users() {
    const users: User[] = await fetchUsers();
    return (
      <div>
        {/* <h1>Gestión de Usuarios</h1> */}
        <ManageUsers initialUsers={users} />
      </div>
    );
}
