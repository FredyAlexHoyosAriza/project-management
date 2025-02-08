import { getSession } from '@auth0/nextjs-auth0';
import Profile from '@/components/users/Profile';

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div>
      <Profile user={user} />
    </div>
  );
}
