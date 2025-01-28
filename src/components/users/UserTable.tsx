import React, { useEffect, useState } from "react";
// import { editRec, patchRec } from "utils/api";
// import useToken from "auth/useToken";
// import { useUser } from "context/UserProvider";
import { UserRowProps, UserTableProps } from "@/types/user";

//React.FC (Function Component): Es un tipo que se usa para tipar componentes funcionales en React.
const UserTable: React.FC<UserTableProps> = ({
  listaUsuarios,
  setShouldGetUsers,
}) => {
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
              <th> Nombre </th>
              <th> Apellido </th>
              <th> Rol </th>
              <th> Estado </th>
            </tr>
          </thead>
          <tbody>
            {usuariosBusqueda.map((usuario) => {
              //({ ..., _id, name, email, role, state, updatedAt })
              return (
                <UserRow
                  key={usuario._id}
                  user={usuario}
                  setShouldGetUsers={setShouldGetUsers}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap justify-around sm:hidden">
        {usuariosBusqueda.map(({ _id, name, surname, email, role, state }) => {
          //({ ..., _id, name, email, role, created_at }) // Cards para tamaños pequeños
          return (
            <div
              key={_id}
              className="bg-slate-500 text-white p-2 m-2 rounded-lg flex flex-col"
            >
              <span>Correo: {email} </span>
              <span>Nombre: {name} </span>
              <span>Nombre: {surname} </span>
              <span>Rol: {role} </span>
              <span>Rol: {state} </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserRow: React.FC<UserRowProps> = ({ user, setShouldGetUsers }) => {
  setShouldGetUsers(false);

  //---------------------------------------------------------------------
  return (
    <tr className=''>
      <td>{user.email}</td>
      <td>{user.name}</td>
      <td>{user.surname}</td>
      <td>{user.role}</td>
      <td>{user.state}</td>
    </tr>
  );
};

export default UserTable;
