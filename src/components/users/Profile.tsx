'use client';
import { useUser } from '@auth0/nextjs-auth0';

export default function Profile() {
  const { user } = useUser();
  if (!user) return <p>No estás autenticado.</p>;

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Email: {user.email}</p>
      <img src={user.picture ?? '/default-profile.png'} alt="Foto de perfil" />
    </div>
  );
}
