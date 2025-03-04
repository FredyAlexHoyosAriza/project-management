// import Profile from '@/components/users/Profile';
import Profile from "@/components/users/Profile";
// import { auth0 } from "@/lib/auth0";
// import Image from "next/image";

export default async function ProfilePage() {
  // const session = await auth0.getSession();
  // const user = session?.user;
  // if (!user) return <p>No estás autenticado.</p>;

  return (<Profile />

    // <div className="flex-grow flex flex-col my-4 place-items-center self-center text-center font-bold text-xl text-slate-900">
    //   <h1 className="text-2xl">Información de usuario</h1>
    //   <Image
    //     className="my-4 rounded-full w-2/3 mx-auto"
    //     src={user.picture ?? "/default-profile.png"}
    //     alt={user.name ?? "Foto de perfil"}
    //     width={200}
    //     height={200}
    //     priority // Opcional: carga prioritaria
    //   />
    //   <h2>{user.name}</h2>
    //   <p>Email: {user.email}</p>
    //   {/* <p>Role: {user.role}</p> */}
    // </div>
  );
}
