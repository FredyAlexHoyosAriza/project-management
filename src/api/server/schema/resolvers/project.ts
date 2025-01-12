import { dbConnect } from "@/api/server/database/mongoose";
import {
  IProject,
  ICreateProject,
  IUpdateProject,
  ProjectModel,
} from "@/api/server/database/models/project";
// import { IResolvers } from "@graphql-tools/utils";
import {
  ICreateObjective,
  IObjective,
  IUpdateObjective,
} from "@/api/server/database/models/objective";

export const projectResolvers = {
  Query: {
    // Obtener todos los proyectos
    getProjects: async () => {
      try {
        await dbConnect();
        return await ProjectModel.find().populate("leader").lean();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching projects: ${error.message}`);
        throw new Error("Failed to fetch projects due to an unknown error.");
      }
    },

    // Obtener un proyecto por ID
    getProjectById: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const project = await ProjectModel.findById(id)
          .populate("leader")
          .lean();
        if (!project) {
          throw new Error(`Project with ID ${id} not found`);
        }
        return project;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching the project: ${error.message}`);
        throw new Error(`Failed to fetch the project due to an unknown error.`);
      }
    },
  },

  Mutation: {
    // Crear un nuevo proyecto
    createProject: async (_: any, { input }: { input: ICreateProject }) => {
      try {
        await dbConnect();
        const newProject: IProject = new ProjectModel(input);
        await newProject.save();
        return newProject;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error creating project: ${error.message}`);
        throw new Error("Failed to create project due to an unknown error."); //throw error;
      }
    },

    updateProject: async (
      _: any,
      { id, input }: { id: string; input: IUpdateProject }
    ) => {
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("El objeto de actualización está vacío.");
        }
        await dbConnect();
    
        // Verificar si el proyecto existe
        //Para tener acceso completo a los métodos de documento y subdocumentos de mongoose 
        //no se debe tipar manualmente la variable que recibe el documento de mongoose; tal que
        //esta posteriormente sea reconocida por TypeScript como un documento de mongoose y no
        //como un objeto del tipo especificado, ejemplo:
        // const project = await ProjectModel.findById(id);
        const project: IProject | null = await ProjectModel.findById(id).lean<IProject>();
        if (!project) {
          throw new Error(`Project with id ${id} not found`);
        }

        //Sintaxis específica para definir objetos dinámicos con claves de tipo string y
        //valores de cualquier tipo. En esta definición de tipo de objeto no se define de forma
        //explicita las keys y los tipos de sus value sino que se da una definición genérica en
        //la que se establece que el objeto contendrá keys de tipo string con values tipo any;
        //Permite agregar claves y valores dinámicamente a los objetos sin restringir las
        //claves a nombres específicos.
        const updates: { [key: string]: any } = {};
        const newObjectives: ICreateObjective[] = [];
        const objectivesToRemove: string[] = [];
    
        if (input.objectives) {
          input.objectives.forEach((objective: IUpdateObjective) => {
            if (objective._id) {
              // const existingObjective = project.objectives.id(objective._id);
              // Buscar índice del objetivo existente
              const index = project.objectives.findIndex(
                ({ _id }) => _id.toString() === objective._id
              );
              if (index === -1) {
                throw new Error(
                  `Objective with id ${objective._id} not found in project`
                );
              }
    
              if (objective.description || objective.type) {
                // Actualizar los campos del objetivo; se agregan campos dinámicamente a updates
                updates[`objectives.${index}.description`] =
                  objective.description ?? project.objectives[index].description;
                updates[`objectives.${index}.type`] =
                  objective.type ?? project.objectives[index].type;
              } else {
                // Marcar el objetivo para eliminación
                objectivesToRemove.push(objective._id);
              }
            } else {
              // Crear un nuevo objetivo
              if (objective.description && objective.type) {
                newObjectives.push({
                  description: objective.description,
                  type: objective.type,
                });
              } else {
                throw new Error(
                  "Create new objective requires description and type fields"
                );
              }
            }
          });
        }
    
        // Actualizar otros campos
        const updatableFields: (keyof IUpdateProject)[] = [
          "name",
          "budget",
          "isActive",
          "phase",
          "startDate",
          "finishDate",
        ];
    
        updatableFields.forEach((key) => {
          if (key in input) {//En updates se agregan claves y valores dinámicamente
            updates[key] = input[key];
          }
        });

        //{ [key: string]: any } -> tipo de dato objeto js para el que las key son string y
        // los value son any    
        // Construir la operación de actualización
        // $set, $push, $pull no son arbitrarios, son operadores MongoDB; MongoDB utiliza una
        // sintaxis flexible para sus operaciones (como $set, $push, $pull), y el tipo
        // { [key: string]: any } permite construir esos objetos de manera programática.
        const updateOperation: { [key: string]: any } = { $set: updates };

        //Posible mejora
        // type MongoUpdateOperation = {
        //   $set?: { [key: string]: any };
        //   $push?: { [key: string]: any };
        //   $pull?: { [key: string]: any };
        // };        
        // const updateOperation: MongoUpdateOperation = { $set: updates };
    
        if (newObjectives.length > 0) {//Se agrega operador $push dinámicamente
          updateOperation.$push = { objectives: { $each: newObjectives } };
        }
    
        if (objectivesToRemove.length > 0) {//Se agrega operador $pull dinámicamente
          updateOperation.$pull = {
            objectives: { _id: { $in: objectivesToRemove } },
          };
        }
    
        // Ejecutar una sola operación de actualización
        const updatedProject = await ProjectModel.findByIdAndUpdate(
          id,
          updateOperation,
          { new: true, runValidators: true }
        ).lean();
    
        return updatedProject;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Failed to update project: ${error.message}`);
        throw new Error("Failed to update project due to an unknown error.");
      }
    }, 

    // Eliminar un proyecto
    deleteProject: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const deletedProject: IProject | null =
          await ProjectModel.findByIdAndDelete(id);
        if (!deletedProject) {
          throw new Error(`Project with id ${id} not found`);
        }
        return true;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting project: ${error.message}`);
        throw new Error("Failed to delete project due to an unknown error.");
      }
    },
  },
};
