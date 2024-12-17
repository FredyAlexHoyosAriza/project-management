import { dbConnect } from "@/lib/mongoose";
import { ProjectModel } from "@/lib/models/project";
import { IProject } from "@/lib/models/project";

export const projectResolvers = {
  Query: {
    // Obtener todos los proyectos
    getProjects: async () => {
      await dbConnect();
      return await ProjectModel.find().lean();
    },

    // Obtener un proyecto por ID
    getProjectById: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      return await ProjectModel.findById(id).lean();
    },
  },

  Mutation: {
    // Crear un nuevo proyecto
    createProject: async (_: any, { input }: { input: IProject }) => {
      await dbConnect();
      const newProject = new ProjectModel(input);
      await newProject.save();
      return newProject;
    },

    // Actualizar un proyecto existente
    updateProject: async (
      _: any,
      { id, input }: { id: string; input: Partial<IProject> }
    ) => {
      await dbConnect();
      const updatedProject = await ProjectModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      }).lean();
      return updatedProject;
    },

    // Eliminar un proyecto
    deleteProject: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      const deletedProject = await ProjectModel.findByIdAndDelete(id);
      return deletedProject ? true : false;
    },
  },
};
