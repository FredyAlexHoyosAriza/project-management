'use client';
import { UserProfile } from '@auth0/nextjs-auth0/client';

type Props = {
  user: UserProfile | undefined;
};

export default function Profile({ user }: Props) {
  if (!user) return <p>No estás autenticado.</p>;

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Email: {user.email}</p>
      <img src={user.picture ?? '/default-profile.png'} alt="Foto de perfil" />
    </div>
  );
}
