import { dbConnect } from "@/api/server/database/mongoose";
import { IUser, ICreateUser, IUpdateUser, UserModel, EState, ERole } from "@/api/server/database/models/user";
import { EnrollmentModel } from "../../database/models/enrollment";

export const userResolvers = {
  Query: {
    // Obtener todos los usuarios
    getUsers: async (): Promise<IUser[]> => {
      try {
        await dbConnect();
        return await UserModel.find()
        .populate({
          path: "assignedProjects",
          select: "name budget isActive phase startDate finishDate objectives",
          populate: [
            {
              path: "leader",
              select: "name surname",
            },
            {
              path: "advances",
              select: "description leaderRemarks updatedAt",
              populate: {
                path: "student",
                select: "name surname",
              },
            },
            {
              path: "enrollments",
              select: "isAccepted entryDate exitDate",
              populate: {
                path: "student",
                select: "name surname",
              },
            },
          ],
        })
        .lean<IUser[]>();
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
        const user = await UserModel.findById(id)
        .populate({
          path: "project",
          select: "name budget isActive phase startDate finishDate objectives",
          populate: [
            {
              path: "leader",
              select: "name surname",
            },
            {
              path: "advances",
              select: "description leaderRemarks updatedAt",
              populate: {
                path: "student",
                select: "name surname",
              },
            },
            {
              path: "enrollments",
              select: "isAccepted entryDate exitDate",
              populate: {
                path: "student",
                select: "name surname",
              },
            },
          ],
        })
        .lean<IUser>();
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
        return await newUser.save();
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
          throw new Error("the update object is empty.");
        }
        await dbConnect();
        const updatedUser = await UserModel.findByIdAndUpdate<IUser>(
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

    // Eliminar un usuario deleted: false
    setUserState: async (_: any, { id, state }: { id: string, state: EState }): Promise<IUser> => {
      try {
        await dbConnect();//UserModel.updateOne({_id: id}, ...)

        const session = await UserModel.startSession();
        session.startTransaction();
        try {
          const user = await UserModel.findByIdAndUpdate(id, { state },
            { session }
          ).lean<IUser>();
          if (!user) {
            throw new Error(`User with ID ${id} not found`);
          }
          if (user.role === ERole.STUDENT) {
            if (state === EState.UNAUTHORIZED) {
              await EnrollmentModel.updateMany({ student: id },
                { $set: { isAccepted: false }},
                { session }
              )
            } else if (state === EState.AUTHORIZED) {
              await EnrollmentModel.updateMany({ student: id },
                { $set: { isAccepted: true }},
                { session }
              )
            }
          }
          await session.commitTransaction();
          return user;
        } catch (error) {
          await session.abortTransaction();
          throw new Error(
            error instanceof Error
              ? `Transaction aborted: ${error.message}`
              : "Transaction aborted due to an unknown error."
          );
        } finally {
          session.endSession();
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting user: ${error.message}`);
        throw new Error("Failed to delete user due to an unknown error.");
      }
    },
  },
};
