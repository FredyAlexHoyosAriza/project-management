import UserForm from '@/components/users/UserForm';
import UserList from '@/components/users/UserList';
import { User } from '@/types/user';

export default function UserPage({ initialUsers }: { initialUsers: User[] }) {
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <UserForm />
      <UserList initialUsers={initialUsers} />
    </div>
  );
}
