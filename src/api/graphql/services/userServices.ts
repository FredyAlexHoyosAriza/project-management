import { ERole, roleAndId, UserModel } from "../../database/models/user";

export const verifyRole = async (userId: string, role: ERole) => {
    const leader = await UserModel.findById(userId).select(
      "role"
    ).lean<roleAndId>();
    if (!leader) {
      throw new Error(`${role} with ID ${userId} does not exist in user collection`);
    }
    if (leader.role !== role) {
      throw new Error(`User with ID ${userId} does not have ${role} role`);
    }
  }