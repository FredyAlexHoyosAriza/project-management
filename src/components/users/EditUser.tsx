"use client";
import { useUser } from "@/context/UserProvider";
import React from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/graphql/user/mutations";
import { toast } from "react-toastify";
import Link from "next/link";
import BeatLoader from "react-spinners/BeatLoader";

const EditUser = () => {
  const { userData, setShouldGetUsers } = useUser();
  const [updateUser, { loading }] = useMutation(UPDATE_USER);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const editedUser = Object.fromEntries(formData.entries());
    try {
      updateUser({ variables: { id: userData?._id, input: editedUser } });
      toast.success("Usuario actualizado con exito");
      setShouldGetUsers(true);
    } catch (error) {
      if (error instanceof Error)
        toast.error(`Error actualizando usuario: ${error.message}`);
      toast.error("Error desconocido al actualizar usuario");
    }
  };

  return (
    <div>
      <Link href={"/admin/users"} className="block text-center">
        <i className="fas fa-arrow-left text-white cursor-pointer font-extrabold hover:text-violet-950">
          {" "}
          Regresar
        </i>
      </Link>
      <form id="user" onSubmit={handleSubmit} className="text-xl lg:w-5/5">
        <legend className="font-bold my-2 text-center">
          Formulario de edición de usuario
        </legend>
        <fieldset>
          <label htmlFor="name" className="block">
            <span className="inline-block pl-2">Nombre: </span>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              defaultValue={userData?.name}
              required
            />
          </label>
          <label htmlFor="surname" className="block">
            <span className="inline-block pl-2">Apellido: </span>
            <input
              id="surname"
              name="surname"
              type="text"
              defaultValue={userData?.surname}
              className="w-full mt-1 min-h-2 rounded-lg"
              required
            />
          </label>
          <label htmlFor="idCard" className="block">
            <span className="inline-block pl-2">Cédula: </span>
            <input
              id="idCard"
              name="idCard"
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              defaultValue={userData?.idCard}
              required
            />
          </label>
          <label htmlFor="email" className="block">
            <span className="inline-block pl-2">Email: </span>
            <input
              id="email"
              name="email"
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              defaultValue={userData?.email}
              required
            />
          </label>
          <label htmlFor="role" className="block">
            <span className="inline-block pl-2">Rol: </span>
            <input
              id="role"
              name="role"
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              defaultValue={userData?.role}
              required
            />
          </label>
          <label htmlFor="state" className="block">
            <span className="inline-block pl-2">Estado: </span>
            <input
              id="state"
              name="state"
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              defaultValue={userData?.state}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full mt-4 min-h-2 rounded-lg border-slate-800 p-2 bg-green-700 text-white boton"
          >{loading ? <BeatLoader color="white" /> : <>Guardar cambios</>}
            
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default EditUser;
