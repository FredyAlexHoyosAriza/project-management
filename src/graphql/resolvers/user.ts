import { dbConnect } from "@/lib/mongoose";
import { UserModel } from "@/lib/models/user";
import { IUser } from "@/lib/models/user";

export const userResolvers = {
  Query: {
    // Obtener todos los usuarios
    getUsers: async () => {
      await dbConnect();
      return await UserModel.find().lean();
    },

    // Obtener un usuario por ID
    getUserById: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      return await UserModel.findById(id).lean();
    },
  },

  Mutation: {
    // Crear un nuevo usuario
    createUser: async (_: any, { input }: { input: IUser }) => {
      await dbConnect();
      const newUser = new UserModel(input);
      await newUser.save();
      return newUser;
    },

    // Actualizar un usuario existente
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: Partial<IUser> }
    ) => {
      await dbConnect();
      const updatedUser = await UserModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      }).lean();
      return updatedUser;
    },

    // Eliminar un usuario
    deleteUser: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      const deletedUser = await UserModel.findByIdAndDelete(id);
      return deletedUser ? true : false;
    },
  },
};
