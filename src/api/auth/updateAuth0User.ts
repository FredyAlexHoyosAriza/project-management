import { IUpdateUser } from "../database/models/user";
import { initAuth0ManagementClient } from "./initAuth0ManagementClient";

// type UpdateMetadata =
//   | {
//       user_metadata: {
//         role?: string;
//         state?: string;
//       };
//     }
//   | { blocked: boolean };

async function updateAuth0User(input: IUpdateUser) {
  //{ user_id, blocked, ...attributes }
  const { user_id, role, state } = input;

  try {
    const auth0 = await initAuth0ManagementClient(); // Inicializa el cliente con el token
    const updateMetadata: { user_metadata: { role?: string; state?: string } } = {
      user_metadata: {},
    };

      if (role) updateMetadata.user_metadata.role = role;
      if (state) updateMetadata.user_metadata.state = state;
      
    // Realiza la actualización del usuario en Auth0
    await auth0.users.update({ id: user_id }, updateMetadata); //const updatedUser = await ...
    console.log("Usuario modificado con exito en Auth0");
  } catch (error) {
    console.error("Error modificando usuario en Auth0:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error",
      { cause: error }
    );
  }
}

export default updateAuth0User;
