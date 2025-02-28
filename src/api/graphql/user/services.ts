import { dbConnect } from "@/api/database/mongoose";
import { IUser, ICreateUser, IUpdateUser, UserModel, EState, ERole } from "@/api/database/models/user";
import { EnrollmentModel } from "@/api/database/models/enrollment";

export const userService = {
  async getUsers(): Promise<IUser[]> {
    try {
      await dbConnect();
      return await UserModel.find()
        .populate({
          path: "leaderships",
          select: "name budget isActive phase startDate finishDate objectives",
          populate: [
            {
              path: "advances",
              select: "description leaderRemarks updatedAt",
              populate: { path: "student", select: "name surname" },
            },
            {
              path: "enrollments",
              select: "isAccepted entryDate exitDate",
              populate: { path: "student", select: "name surname" },
            },
          ],
        })
        .populate({
          path: "inscriptions",
          select: "isAccepted entryDate exitDate",
          populate: {
            path: "project",
            select: "name budget isActive phase startDate finishDate objectives",
            populate: [
              { path: "leader", select: "name surname" },
              {
                path: "advances",
                select: "description leaderRemarks updatedAt",
                populate: { path: "student", select: "name surname" },
              },
            ],
          },
        })
        .lean<IUser[]>();
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching users: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },

  async getUsersWithAdvances(): Promise<IUser[]> {
    try {
      await dbConnect();
      return await UserModel.find()
        .populate({
          path: "ownAdvances",
          select: "description leaderRemarks updatedAt",
          populate: {
            path: "project",
            select: "name budget isActive phase",
            populate: { path: "leader", select: "name surname" },
          },
        })
        .lean<IUser[]>();
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        throw new Error(`Error fetching users: ${error.message}`);
      throw new Error("Failed to fetch users due to an unknown error.");
    }
  },

  async getUserWithAdvancesById(id: string): Promise<IUser> {
    try {
      await dbConnect();
      const user = await UserModel.findById(id)
        .populate({
          path: "ownAdvances",
          select: "description leaderRemarks updatedAt",
          populate: {
            path: "project",
            select: "name budget isActive phase startDate finishDate",
            populate: { path: "leader", select: "name surname idCard email state" },
          },
        })
        .lean<IUser>();
      if (!user) throw new Error(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        throw new Error(`Error fetching users: ${error.message}`);
      throw new Error("Failed to fetch users due to an unknown error.");
    }
  },

  async getUserById(id: string): Promise<IUser> {
    try {
      await dbConnect();
      const user = await UserModel.findById(id)
        .populate({
          path: "leaderships",
          select: "name budget isActive phase startDate finishDate objectives",
          populate: [
            {
              path: "advances",
              select: "description leaderRemarks updatedAt",
              populate: { path: "student", select: "name surname" },
            },
          ],
        })
        .lean<IUser>();
      if (!user) throw new Error(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        throw new Error(`Error fetching the user: ${error.message}`);
      throw new Error(`Failed to fetch the user due to an unknown error.`);
    }
  },

  async createUser(input: ICreateUser): Promise<IUser> {
    try {
      await dbConnect();
      const newUser = new UserModel(input);
      return await newUser.save();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) 
        throw new Error(`Error creating user: ${error.message}`);
      throw new Error("Failed to create user due to an unknown error.");//throw error;
    }
  },

  async updateUser(id: string, input: IUpdateUser): Promise<IUser> {
    try {
      await dbConnect();
      const updatedUser = await UserModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!updatedUser) throw new Error(`User with ID ${id} not found`);
      return updatedUser;
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        throw new Error(`Error updating user: ${error.message}`);
      throw new Error("Failed to update user due to an unknown error.");
    }
  },

  async setUserState(id: string, state: EState): Promise<IUser> {
    try {
      await dbConnect();
      const session = await UserModel.startSession();
      session.startTransaction();
      try {
        const user = await UserModel.findByIdAndUpdate(id, { state }, { session }).lean<IUser>();
        if (!user) throw new Error(`User with ID ${id} not found`);

        if (user.role === ERole.STUDENT) {
          const update = { isAccepted: state === EState.AUTHORIZED };
          await EnrollmentModel.updateMany({ student: id }, { $set: update }, { session });
        }

        await session.commitTransaction();
        return user;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        throw new Error(`Error setting user state: ${error.message}`);
      throw new Error("Failed to set state due to an unknown error.");
    }
  },
};


export const verifyUser = async (userId: string, role: ERole) => {
  const user = await UserModel.findOne({
    _id: userId,
    role: role,
    state: EState.AUTHORIZED,
  })
    .select("_id")
    .lean<{_id: string}>();

  if (!user) {
    throw new Error(
      `User with ID ${userId} does not exist, does not have the role ${role}, or is not authorized.`
    );
  }
};
