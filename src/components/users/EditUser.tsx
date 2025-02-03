"use client";
import { useUser } from "@/context/UserProvider";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/graphql/user/mutations";
import { toast } from "react-toastify";
import Link from "next/link";
import BeatLoader from "react-spinners/BeatLoader";
import { User } from "@/types/user";

const EditUser = () => {
  const { userData, setShouldGetUsers } = useUser();

  const [updateUser, { loading }] = useMutation(UPDATE_USER);
  const [formValues, setFormValues] = useState(
    userData ?? {
      _id: "",
      name: "",
      surname: "",
      idCard: "",
      email: "",
      role: "",
      state: "",
      createdAt: "",
      updatedAt: "",
    }
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Detectar cambios en el formulario
  useEffect(() => {
    setHasChanges(JSON.stringify(formValues) !== JSON.stringify(userData));
  }, [formValues, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const editedUser = Object.fromEntries(formData.entries());
    try {
      updateUser({ variables: { id: userData?._id, input: editedUser } });
      toast.success("Usuario actualizado con éxito");
      setShouldGetUsers(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error actualizando usuario: ${error.message}`
          : "Error desconocido al actualizar usuario"
      );
    }
  };

  const updatableFields: (keyof User)[] = [
    "name",
    "surname",
    "idCard",
    "email",
    // "state",
  ];

  return userData ? (
    <div>
      <GoBack />
      <form id="user" onSubmit={handleSubmit} className="text-xl lg:w-5/5">
        <legend className="font-bold my-2 text-center">
          Formulario de edición de usuario
        </legend>
        <fieldset>
          {updatableFields.map((field) => (
            <label key={field} htmlFor={field} className="block">
              <span className="inline-block pl-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
              </span>
              <input
                id={field}
                name={field}
                type="text"
                className="w-full mt-1 min-h-2 rounded-lg"
                value={formValues[field] || ""}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <label htmlFor="state" className="block">
            <span className="inline-block pl-2">State: </span>
            <select
              id="state"
              value={formValues.state}
              onChange={handleChange}
              name="state"
              className="w-full min-h-2 rounded-lg"
              required
            >
              <option value={""} disabled>
                Seleccione un rol
              </option>
              <option value="AUTHORIZED">autorizado</option>
              <option value="UNAUTHORIZED">no autorizado</option>
              <option value="PENDING">pendiente</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={!hasChanges || loading}
            className={`w-full mt-4 min-h-2 rounded-lg p-2 text-white boton ${
              !hasChanges || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700"
            }`}
          >
            {loading ? <BeatLoader color="white" /> : "Guardar cambios"}
          </button>
        </fieldset>
      </form>
    </div>
  ) : (
    <GoBack />
  );
};

const GoBack = () => {
  return (
    <Link href={"/admin/users"} className="block text-center">
      <i className="fas fa-arrow-left text-white cursor-pointer font-extrabold hover:text-violet-950">
        Regresar
      </i>
    </Link>
  );
};

export default EditUser;

// "use client";
// import { useUser } from "@/context/UserProvider";
// import React, { useEffect, useState } from "react";
// import { useMutation } from "@apollo/client";
// import { UPDATE_USER } from "@/graphql/user/mutations";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import BeatLoader from "react-spinners/BeatLoader";
// // import { User } from "@/types/user";

// const EditUser = () => {
//   const { userData, setShouldGetUsers } = useUser();
//   if (userData) {
//     const { _id, createdAt, updatedAt, ...partialUser } = userData;
//     const [updateUser, { loading }] = useMutation(UPDATE_USER);
//     const [formValues, setFormValues] = useState(partialUser);
//     const [hasChanges, setHasChanges] = useState(false);

//     // Detectar cambios en el formulario
//     useEffect(() => {
//       setHasChanges(JSON.stringify(formValues) !== JSON.stringify(partialUser));
//     }, [formValues, userData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       // const formData = new FormData(e.currentTarget);
//       // const editedUser = Object.fromEntries(formData.entries());
//       try {
//         updateUser({ variables: { id: _id, input: formValues } });
//         toast.success("Usuario actualizado con exito");
//         setShouldGetUsers(true);
//       } catch (error) {
//         toast.error(
//           error instanceof Error
//             ? `Error actualizando usuario: ${error.message}`
//             : "Error desconocido al actualizar usuario"
//         );
//       }
//     };

//     return (
//       <div>
//         <Link href={"/admin/users"} className="block text-center">
//           <i className="fas fa-arrow-left text-white cursor-pointer font-extrabold hover:text-violet-950">
//             {" "}
//             Regresar
//           </i>
//         </Link>
//         <form id="user" onSubmit={handleSubmit} className="text-xl lg:w-5/5">
//           <legend className="font-bold my-2 text-center">
//             Formulario de edición de usuario
//           </legend>
//           <fieldset>
//             <label htmlFor="name" className="block">
//               <span className="inline-block pl-2">Nombre: </span>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues.name}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label htmlFor="surname" className="block">
//               <span className="inline-block pl-2">Apellido: </span>
//               <input
//                 id="surname"
//                 name="surname"
//                 type="text"
//                 value={formValues.surname}
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label htmlFor="idCard" className="block">
//               <span className="inline-block pl-2">Cédula: </span>
//               <input
//                 id="idCard"
//                 name="idCard"
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues.idCard}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label htmlFor="email" className="block">
//               <span className="inline-block pl-2">Email: </span>
//               <input
//                 id="email"
//                 name="email"
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues.email}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label htmlFor="role" className="block">
//               <span className="inline-block pl-2">Rol: </span>
//               <input
//                 id="role"
//                 name="role"
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues.role}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label htmlFor="state" className="block">
//               <span className="inline-block pl-2">Estado: </span>
//               <input
//                 id="state"
//                 name="state"
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues.state}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <button
//               type="submit"
//               disabled={!hasChanges || loading}
//               className={`w-full mt-4 min-h-2 rounded-lg p-2 text-white boton ${
//                 !hasChanges || loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-700"
//               }`}
//             >
//               {loading ? <BeatLoader color="white" /> : "Guardar cambios"}
//             </button>
//           </fieldset>
//         </form>
//       </div>
//     );
//   }
// };

// export default EditUser;
