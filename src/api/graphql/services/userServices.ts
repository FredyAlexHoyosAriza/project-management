import { ERole, EState, UserModel } from "../../database/models/user";

export const verifyRole = async (userId: string, role: ERole) => {
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
