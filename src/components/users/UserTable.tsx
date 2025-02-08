import React, { useEffect, useState } from "react";
import { Role, State, User, UserRowProps, UserTableProps } from "@/types/user";
import Link from "next/link";
import { useUserEditing } from "@/context/UserEditingProvider";

//React.FC (Function Component): Es un tipo que se usa para tipar componentes funcionales en React.
const UserList: React.FC<UserTableProps> = ({ listaUsuarios }) => {
  const [busqueda, setBusqueda] = useState("");
  const [usuariosBusqueda, setUsuariosBusqueda] = useState([...listaUsuarios]);

  useEffect(() => {
    console.log(busqueda);
    if (busqueda !== "") {
      setUsuariosBusqueda(
        listaUsuarios.filter((usuario) => {
          return JSON.stringify(usuario)
            .toLowerCase()
            .includes(busqueda.toLowerCase());
        })
      );
    } else {
      setUsuariosBusqueda(listaUsuarios);
    }
  }, [busqueda, listaUsuarios]);

  return (
    <div className="w-full text-xl text-gray-900 tabla">
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar"
        className="rounded-lg block mx-auto border border-gray-700 px-4 py-2"
      />
      <legend className="text-center font-extrabold my-2">
        Todas las cuentas de usuario
      </legend>
      <div className="hidden lg:block">
        <table className="w-full min-w-96">
          <thead>
            <tr>
              <th> Correo </th>
              <th> Nombre Apellido </th>
              <th> Cédula </th>
              <th> Rol </th>
              <th> Estado </th>
              <th> Editar </th>
            </tr>
          </thead>
          <tbody>
            {usuariosBusqueda.map((usuario) => {
              //({ ..., _id, name, email, role, state, updatedAt })
              return <UserRow key={usuario._id} user={usuario} />;
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-around lg:hidden">
        {usuariosBusqueda.map((user) => {
          //({ ..., _id, name, email, role, idCard }) // Cards para tamaños pequeños
          return (
            <div
              key={user._id}
              className="bg-slate-500 text-white p-2 m-2 rounded-lg flex flex-col"
            >
              <span>Correo: {user.email} </span>
              <span>Nombre: {user.name} </span>
              <span>Apellido: {user.surname} </span>
              <span>Cédula: {user.idCard} </span>
              <span>Rol: {Role[user.role]} </span>
              <span>Estado: {State[user.state]} </span>
              <span>Editar: <EditUserLink user={user} /> </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  //---------------------------------------------------------------------
  return (
    <tr className="">
      <td>{user.email}</td>
      <td>{`${user.name} ${user.surname}`}</td>
      <td>{user.idCard}</td>
      <td>{Role[user.role]}</td>
      <td>{State[user.state]}</td>
      <td className="text-center"><EditUserLink user={user} /></td>
    </tr>
  );
};

const EditUserLink = ({ user }: { user: User }) => {
  const { setUserData } = useUserEditing ();
  return (
    <Link href={`/admin/users/edit:${user.name?.replaceAll(" ", "-")}`}>
      <i
        onClick={() => setUserData(user)}
        className="fas fa-pencil-alt text-indigo-800 hover:text-indigo-500"
        title="Edit"
      />
    </Link>
  );
};

export default UserList;
