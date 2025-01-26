import { fetchUsers } from '@/services/userService';
import UserPage from './UserPage';

export default async function UsersPage() {
  const users = await fetchUsers();

  return <UserPage initialUsers={users} />;
}