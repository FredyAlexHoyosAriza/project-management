import React, { useEffect, useState } from "react";
import { UserRowProps, UserTableProps } from "@/types/user";
import Link from "next/link";
import { useUser } from "@/context/UserProvider";

//React.FC (Function Component): Es un tipo que se usa para tipar componentes funcionales en React.
const UserTable: React.FC<UserTableProps> = ({ listaUsuarios }) => {
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
      <div className="hidden sm:block">
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
      <div className="flex flex-wrap justify-around sm:hidden">
        {usuariosBusqueda.map(({ _id, name, surname, idCard, email, role, state }) => {
          //({ ..., _id, name, email, role, idCard }) // Cards para tamaños pequeños
          return (
            <div
              key={_id}
              className="bg-slate-500 text-white p-2 m-2 rounded-lg flex flex-col"
            >
              <span>Correo: {email} </span>
              <span>Nombre: {name} </span>
              <span>Apellido: {surname} </span>
              <span>Cédula: {idCard} </span>
              <span>Rol: {role} </span>
              <span>State: {state} </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const { setUserData } = useUser();

  //---------------------------------------------------------------------
  return (
    <tr className="">
      <td>{user.email}</td>
      <td>{`${user.name} ${user.surname}`}</td>
      <td>{user.idCard}</td>
      <td>
        {user.role === "STUDENT"
          ? "estudiante"
          : user.role === "LEADER"
          ? "líder"
          : "administrador"}
      </td>
      <td>
        {user.state === "AUTHORIZED"
          ? "autorizado"
          : user.state === "UNAUTHORIZED"
          ? "no autorizado"
          : "pendiente"}
      </td>
      <td className="text-center">
        <Link href={`/admin/users/edit:${user.name?.replaceAll(" ", "-")}`}>
          <i
            onClick={() => setUserData(user)}
            className="fas fa-pencil-alt text-indigo-800 hover:text-indigo-500"
            title="Edit"
          />
        </Link>
      </td>
    </tr>
  );
};

export default UserTable;
