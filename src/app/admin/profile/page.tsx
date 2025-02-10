// import Profile from '@/components/users/Profile';
import { auth0 } from '@/lib/auth0';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user) return <p>No estás autenticado.</p>;

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Email: {user.email}</p>
      <Image 
        src={user.picture ?? '/default-profile.png'} 
        alt="Foto de perfil" 
        width={100}  // Ajusta el tamaño según lo que necesites
        height={100} 
        className="rounded-full object-cover"  // Opcional: Estilo para imagen circular
      />
    </div>
  );
}
