import { ProjectModel } from "@/api/database/models/project";
import { ObjectId } from "mongoose";

export const verifyProject = async (projectId: string) => {
    const project = await ProjectModel.findOne({ _id: projectId, isActive: true }).select('_id').lean<{_id: ObjectId}>();
    if (!project) {
      throw new Error(`Project with id ${projectId} not found or unactive.`);
    }
}