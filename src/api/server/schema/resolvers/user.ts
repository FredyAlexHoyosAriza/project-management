import { dbConnect } from "@/api/server/database/mongoose";
import { IUser, ICreateUser, IUpdateUser, UserModel } from "@/api/server/database/models/user";

export const userResolvers = {
  Query: {
    // Obtener todos los usuarios
    getUsers: async (): Promise<IUser[]> => {
      try {
        await dbConnect();
        return await UserModel.find();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching users: ${error.message}`);
        throw new Error("Failed to fetch users due to an unknown error.");
      }
    },

    // Obtener un usuario por ID
    getUserById: async (_: any, { id }: { id: string }): Promise<IUser> => {
      try {
        await dbConnect();
        const user: IUser | null = await UserModel.findById(id);
        if (!user) {
          throw new Error(`User with ID ${id} not found`);
        }
        return user;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching the user: ${error.message}`);
        throw new Error(`Failed to fetch the user due to an unknown error.`);
      }
    },
  },

  Mutation: {
    // Crear un nuevo usuario
    createUser: async (_: any, { input }: { input: ICreateUser }): Promise<IUser> => {
      try {
        await dbConnect();
        const newUser: IUser = new UserModel(input);
        await newUser.save();
        // console.log(newUser);
        return newUser;
      } catch (error) {
        console.error(error);
        if (error instanceof Error) 
          throw new Error(`Error creating user: ${error.message}`);
        throw new Error("Failed to create user due to an unknown error.");//throw error;
      }
    },
    // _: Representa el objeto padre o root en GraphQL. En este caso, no se usa, pero sigue
    // siendo obligatorio incluirlo en la función. Se usa un guion bajo (_) para indicar que
    // no se necesita.

    // Actualizar un usuario existente
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: IUpdateUser }//Partial<IUser>
    ): Promise<IUser> => {
      await dbConnect();
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("El objeto de actualización esta vacío.");
        }
        await dbConnect();
        const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error(`User with ID ${id} not found.`);
        }
        console.log(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error updating user: ${error.message}`);
        throw new Error("Failed to update user due to an unknown error.");
      }
    },

    // Eliminar un usuario
    deleteUser: async (_: any, { id, email }: { id: string, email: string }): Promise<boolean> => {
      try {
        await dbConnect();
        const deletedUser = {};
        if (id) {
          const deletedUser: IUser | null = await UserModel.findByIdAndDelete(id);
        } else if (email) {
          const deletedUser: IUser | null = await UserModel.findOneAndDelete({ email: email });
        } else {
          throw new Error("El objeto de eliminación esta vacío.");
        }
        if (!deletedUser) {
          throw new Error(`User with ID ${id} not found.`);
        }
        return true;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting user: ${error.message}`);
        throw new Error("Failed to delete user due to an unknown error.");
      }
    },
  },
};
