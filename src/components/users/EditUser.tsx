// "use client";
// import { useUserEditing } from "@/context/UserEditingProvider";
// import React, { useState, useEffect } from "react";
// import { useMutation } from "@apollo/client";
// import { UPDATE_USER } from "@/graphql/user/mutations";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import BeatLoader from "react-spinners/BeatLoader";
// import { User } from "@/types/user";

// const EditUser = () => {
//   const { userData, setUserData, setShouldGetUsers } = useUserEditing ();

//   const [updateUser, { data, error, loading }] = useMutation(UPDATE_USER);
//   const [formValues, setFormValues] = useState(
//     userData ?? {
//       _id: "",
//       name: "",
//       surname: "",
//       idCard: "",
//       email: "",
//       role: "",
//       state: "",
//       updatedAt: "",
//     }
//   );
//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     if (data) {
//       setUserData(data.updateUser);
//       setFormValues(data.updateUser);
//       toast.success("Usuario actualizado con éxito");
//       setShouldGetUsers(true);
//     }
//   }, [data, setShouldGetUsers, setUserData]);

//   useEffect(() => {
//     if (error) {
//       toast.error(`Error actualizando usuario: ${error.message}`);
//     }
//   }, [error]);

//   // Detectar cambios en el formulario
//   useEffect(() => {
//     setHasChanges(JSON.stringify(formValues) !== JSON.stringify(userData));
//   }, [formValues, userData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const editedUser = Object.fromEntries(formData.entries());

//     updateUser({ variables: { id: userData?._id, input: editedUser } })
//     .catch((err) => {
//       // Esto es solo una capa extra de seguridad en caso de que el error no pase por Apollo
//       toast.error(`Error desconocido al actualizar usuario: ${err.message}`);
//     });
// };

//   const esKeys = ["Nombre:", "Apellido:", "Cédula:", "Email:"];

//   const updatableFields: (keyof User)[] = [
//     "name",
//     "surname",
//     "idCard",
//     "email",
//     // "state",
//   ];

//   return userData ? (
//     <div>
//       <GoBack />
//       <form id="user" onSubmit={handleSubmit} className="text-xl lg:w-5/5">
//         <legend className="font-bold my-2 text-center">
//           Formulario de edición de usuario
//         </legend>
//         <fieldset>
//           {updatableFields.map((field, i) => (
//             <label key={field} htmlFor={field} className="block mb-1">
//               <span className="inline-block pl-2">
//                 {esKeys[i]}
//                 {/* {field.charAt(0).toUpperCase() + field.slice(1)}:{" "} */}
//               </span>
//               <input
//                 id={field}
//                 name={field}
//                 type="text"
//                 className="w-full mt-1 min-h-2 rounded-lg"
//                 value={formValues[field]}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//           ))}
//           <label htmlFor="state" className="block mb-1">
//             <span className="inline-block pl-2">Estado: </span>
//             <select
//               id="state"
//               value={formValues.state}
//               onChange={handleChange}
//               name="state"
//               className="w-full mt-1 min-h-2 rounded-lg"
//               required
//             >
//               <option value={""} disabled>
//                 Seleccione un rol
//               </option>
//               <option value="AUTHORIZED">autorizado</option>
//               <option value="UNAUTHORIZED">no autorizado</option>
//               <option value="PENDING">pendiente</option>
//             </select>
//           </label>
//           <button
//             type="submit"
//             disabled={!hasChanges || loading}
//             className={`w-full mt-4 min-h-2 rounded-lg p-2 text-white boton ${
//               !hasChanges || loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-700"
//             }`}
//           >
//             {loading ? <BeatLoader color="white" /> : "Guardar cambios"}
//           </button>
//         </fieldset>
//       </form>
//     </div>
//   ) : (
//     <GoBack />
//   );
// };

// const GoBack = () => {
//   return (
//     <Link href={"/admin/users"} className="block text-center">
//       <i className="fas fa-arrow-left text-white cursor-pointer font-extrabold hover:text-violet-950">
//       {' Regresar'}
//       </i>
//     </Link>
//   );
// };

// export default EditUser;

"use client";
import { useUserEditing } from "@/context/UserEditingProvider";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/graphql/user/mutations";
import { toast } from "react-toastify";
import Link from "next/link";
import BeatLoader from "react-spinners/BeatLoader";
import { Role, State, User } from "@/types/user";
import Input from "../Input";
import Dropdown from "../Dropdown";

const EditUser = () => {
  const { userData, setUserData, setShouldGetUsers } = useUserEditing ();

  const [updateUser, { data, error, loading }] = useMutation(UPDATE_USER);
  const [formValues, setFormValues] = useState(
    userData ?? {
      _id: "",
      name: "",
      surname: "",
      idCard: "",
      email: "",
      role: "",
      state: "",
      updatedAt: "",
    }
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setUserData(data.updateUser);
      setFormValues(data.updateUser);
      toast.success("Usuario actualizado con éxito");
      setShouldGetUsers(true);
    }
  }, [data, setShouldGetUsers, setUserData]);

  useEffect(() => {
    if (error) {
      toast.error(`Error actualizando usuario: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    setHasChanges(JSON.stringify(formValues) !== JSON.stringify(userData));
  }, [formValues, userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const editedUser = Object.fromEntries(formData.entries());

    updateUser({ variables: { id: userData?._id, input: editedUser } }).catch(
      (err) => {
        toast.error(`Error desconocido al actualizar usuario: ${err.message}`);
      }
    );
  };

  const esKeys = ["Nombre:", "Apellido:", "Cédula:", "Email:"];

  const updatableFields: (keyof User)[] = [
    "name",
    "surname",
    "idCard",
    "email",
  ];

  return userData ? (
    <div>
      <GoBack />
      <form id="user" onSubmit={handleSubmit} className="text-xl lg:w-5/5">
        <legend className="font-bold my-2 text-center">
          Edición de {Role[userData.role]}
        </legend>
        <fieldset>
          {updatableFields.map((field, i) => (
            <Input
              key={field}
              id={field}
              name={field}
              type="text"
              className="w-full mt-1 min-h-2 rounded-lg"
              value={formValues[field] ?? ""}
              onChange={handleChange}
              required
              label={esKeys[i]}
            />
          ))}
          <Dropdown
            id="state"
            name="state"
            className="w-full mt-1 min-h-2 rounded-lg"
            value={formValues.state}
            onChange={handleChange}
            required
            label="Estado:"
            options={State}
          />
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
        {" Regresar"}
      </i>
    </Link>
  );
};

export default EditUser;
