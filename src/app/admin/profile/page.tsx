// import Profile from '@/components/users/Profile';
import { auth0 } from '@/lib/auth0';

export default async function ProfilePage() {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user) return <p>No estás autenticado.</p>;

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Email: {user.email}</p>
      <img src={user.picture ?? '/default-profile.png'} alt="Foto de perfil" />
    </div>
  );
}
