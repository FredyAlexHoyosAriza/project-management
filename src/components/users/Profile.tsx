"use client";
import { useAuth } from "@/context/AuthProvider";
import { Role, State } from "@/types/user";
import Image from "next/image";
import Loading from "../Loading";

export default function Profile() {
  const { userInfo } = useAuth();
  if (!userInfo) return <Loading />;

  return (
    <div className="flex-grow flex flex-col my-4 place-items-center self-start text-center font-bold text-xl text-slate-900">
      <h1 className="text-2xl">Información de usuario</h1>
      <Image
        className="my-4 rounded-full w-36 mx-auto"
        src={userInfo.picture ?? "/default-profile.png"}
        alt={userInfo.name ?? "Foto de perfil"}
        width={100}
        height={100}
        priority // Opcional: carga prioritaria
      />
      <h2>Nombre: {userInfo.name}</h2>
      <p>Correo: {userInfo.email}</p>
      <p>Rol: {Role[userInfo.role]} </p>
      <p>Estado: {State[userInfo.state]}</p>
      <p>Última actualización: {userInfo.updated_at}</p>
    </div>
  );
}
