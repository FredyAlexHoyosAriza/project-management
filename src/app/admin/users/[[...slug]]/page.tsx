import { fetchUsers } from "@/services/userService";
import { User } from "@/types/user";

import ManageUsers from "@/components/users/ManageUsers";

export default async function Users({ params }: { params: { slug?: string[] }}) {
  const { slug } = await params;
  // Manejo de casos
  if (slug && slug[0].startsWith("edit%3A")) {
    const userId = slug[0].replace("edit%3A", ""); // Extrae el ID removiendo "edit:"
    return <h1>Editando usuario con ID: {userId}</h1>;
  } else if (slug) {
    return <h1>Mostrando usuario con ID: {slug[0]}</h1>;
  } else {
    const users: User[] = await fetchUsers();
    return (
      <div>
        {/* <h1>Gestión de Usuarios</h1> */}
        <ManageUsers initialUsers={users} />
      </div>
    );
  }
}
