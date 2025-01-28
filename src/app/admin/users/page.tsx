import { fetchUsers } from '@/services/userService';
import { User } from '@/types/user';
// import UserPage from './UserPage';
// // import UserPage from './ManageUsers';

// export default async function UsersPage() {
//   const users: User[] = await fetchUsers();
//   return <UserPage initialUsers={users} />;
// }

import ManageUsers from '@/components/users/ManageUsers';

export default async function UsersPage() {
  const users: User[] = await fetchUsers();
  return (
    <div>
      {/* <h1>Gestión de Usuarios</h1> */}
      <ManageUsers initialUsers={users} />
    </div>
  );
}
