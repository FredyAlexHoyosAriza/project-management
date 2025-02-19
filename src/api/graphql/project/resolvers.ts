import { dbConnect } from "@/api/database/mongoose";
import {
  IProject,
  ICreateProject,
  IUpdateProject,
  ProjectModel,
} from "@/api/database/models/project";
// import { IResolvers } from "@graphql-tools/utils";
import {
  ICreateObjective,
  IUpdateObjective,
} from "@/api/database/models/objective";
import { AdvanceModel } from "../../database/models/advance";
import { EnrollmentModel } from "../../database/models/enrollment";
import { ERole } from "../../database/models/user";
import { verifyRole } from "../user/services";
import { JWTPayload } from "jose";
import { authGuard } from "../authService";

export const projectResolvers = {
  Query: {
    // Obtener todos los proyectos
    getProjects: async (): Promise<IProject[]> => {
      try {
        await dbConnect();
        return await ProjectModel.find()
          .populate("leader", "name surname idCard email state updatedAt")
          .populate({
            path: "advances",
            select: "description leaderRemarks updatedAt",
            populate: {
              path: "student",
              select: "name surname",
            },
          })
          .populate({
            path: "enrollments",
            select: "isAccepted entryDate exitDate updatedAt",
            populate: {
              path: "student",
              select: "name surname",
            },
          })
          .lean<IProject[]>();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching projects: ${error.message}`);
        throw new Error("Failed to fetch projects due to an unknown error.");
      }
    },

    // Obtener un proyecto por ID
    getProjectById: async (
      _: unknown,
      { id }: { id: string }
    ): Promise<IProject> => {
      try {
        await dbConnect();
        const project = await ProjectModel.findById(id)
          .populate("leader", "name surname idCard email state updatedAt")
          .populate({
            path: "advances",
            select: "description leaderRemarks createdAt updatedAt",
            populate: {
              path: "student",
              select: "name surname email idCard state updatedAt",
            },
          })
          .populate({
            path: "enrollments",
            select: "isAccepted entryDate exitDate updatedAt",
            populate: {
              path: "student",
              select: "name surname email idCard state updatedAt",
            },
          })
          .lean<IProject>();
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
    createProject: async (
      _: unknown,
      { input }: { input: ICreateProject }
    ): Promise<IProject> => {
      try {
        await dbConnect();
        let newProject: IProject = new ProjectModel(input);
        await verifyRole(<string>input.leader, ERole.LEADER);
        newProject = await newProject.save(); //.lean() solo puede usarse con funciones: find, findOne
        // await UserModel.updateOne(
        //   { _id: input.leader },
        //   { $push: { assignedProjects: newProject._id } },
        //   { session }
        // );
        return newProject;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error creating project: ${error.message}`);
        throw new Error("Failed to create project due to an unknown error."); //throw error;
      }
    },

    updateProject: async (
      _: unknown,
      { id, input }: { id: string; input: IUpdateProject }
    ): Promise<IProject> => {
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("El objeto de actualización está vacío.");
        }
        await dbConnect();

        // Verificar si el proyecto existe
        //Para tener acceso completo no solo a los métodos de documento sino también a los de
        //subdocumentos de mongoose no se debe tipar manualmente la variable que recibe el
        //documento de mongoose; tal que esta posteriormente sea reconocida por TypeScript como
        //un documento de mongoose y no como un objeto del tipo especificado, ejemplo:
        // const project = await ProjectModel.findById(id);
        const project = await ProjectModel.findById(id).lean<IProject>();
        if (!project) {
          throw new Error(`Project with id ${id} not found`);
        }

        //Sintaxis específica para definir objetos dinámicos con claves de tipo string y
        //valores de cualquier tipo. En esta definición de tipo de objeto no se define de forma
        //explicita las keys y los tipos de sus value sino que se da una definición genérica en
        //la que se establece que el objeto contendrá keys de tipo string con values tipo unknown;
        //Permite agregar claves y valores dinámicamente a los objetos sin restringir las
        //claves a nombres específicos.
        const updates: { [key: string]: unknown } = {};
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
                  objective.description ??
                  project.objectives[index].description;
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
          "leader",
        ];

        updatableFields.forEach((key) => {
          if (key in input) {
            //En updates se agregan claves y valores dinámicamente
            updates[key] = input[key];
          }
        });
        const hasObjectivesToUpdate = Object.keys(updates).length > 0 ? 1 : 0;
        const hasNewObjectives = newObjectives.length > 0 ? 1 : 0;
        const hasObjectivesToRemove = objectivesToRemove.length > 0 ? 1 : 0;

        if (
          hasObjectivesToUpdate + hasNewObjectives + hasObjectivesToRemove <
          2
        ) {
          //{ [key: string]: unknown } -> tipo de dato objeto js para el que las key son string y
          // los value son unknown
          // Construir la operación de actualización
          // $set, $push, $pull no son arbitrarios, son operadores MongoDB; MongoDB utiliza una
          // sintaxis flexible para sus operaciones (como $set, $push, $pull), y el tipo
          // { [key: string]: unknown } permite construir esos objetos de manera programática.
          const updateOperation: { [key: string]: unknown } = {};
          if (Object.keys(updates).length > 0) updateOperation.$set = updates;

          if (hasNewObjectives) {
            //Se agrega operador $push dinámicamente
            updateOperation.$push = { objectives: { $each: newObjectives } };
          }

          if (hasObjectivesToRemove) {
            //Se agrega operador $pull dinámicamente
            updateOperation.$pull = {
              objectives: { _id: { $in: objectivesToRemove } },
            };
          }

          const session = await ProjectModel.startSession();
          session.startTransaction();
          try {
            const updatedProject = (await ProjectModel.findByIdAndUpdate(
              id,
              updateOperation,
              { session }
            ).lean<IProject>()) as IProject;
            
            if (input.leader) {
              await verifyRole(<string>input.leader, ERole.LEADER);
              // await UserModel.updateOne(
              //   { _id: input.leader },
              //   { $addToSet: { assignedProjects: id } },
              //   { session }
              // );
            }
            await session.commitTransaction();
            return updatedProject;
          } catch (error) {
            await session.abortTransaction();
            throw error;
          } finally {
            session.endSession();
          }
        } else {
          // Realizar operaciones simultaneas de eliminación, creación y actualización sobre el
          // mismo campo de un documento genera un error de mongoDB, puesto que podría causar
          // conflictos que lleven a error; p. ej. para un proyecto intentar eliminar y actualizar
          // el mismo objetivo en el mismo acceso a DB

          // Aplicar operaciones en pasos separados
          const session = await ProjectModel.startSession();
          session.startTransaction();

          try {
            // 1. Actualizar los campos y objetivos existentes
            if (Object.keys(updates).length > 0) {
              await ProjectModel.updateOne(
                { _id: id },
                { $set: updates },
                { session }
              );
            }

            // 2. Agregar nuevos objetivos
            if (hasNewObjectives) {
              // updateOne no devuelve el documento actualizado lo cual lo hace más eficiente
              // que findByIdAndUpdate
              await ProjectModel.updateOne(
                { _id: id },
                { $push: { objectives: { $each: newObjectives } } },
                { session }
              );
            }

            // 3. Eliminar objetivos
            if (hasObjectivesToRemove) {
              await ProjectModel.updateOne(
                { _id: id },
                { $pull: { objectives: { _id: { $in: objectivesToRemove } } } },
                { session }
              );
            }

            if (input.leader) {
              await verifyRole(<string>input.leader, ERole.LEADER);
              // await UserModel.updateOne(
              //   { _id: input.leader },
              //   { $addToSet: { assignedProjects: id } },
              //   { session }
              // );
            }

            await session.commitTransaction();
            session.endSession();

            // Obtener el documento actualizado
            return (await ProjectModel.findById(
              id
            ).lean<IProject>()) as IProject;
          } catch (error) {
            await session.abortTransaction(); //Se abortan todos los cambios en DB
            session.endSession();
            throw error;
          }
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Failed to update project: ${error.message}`);
        throw new Error("Failed to update project due to an unknown error.");
      }
    },

    // Eliminar un proyecto
    deleteProject: async (_: unknown, { id }: { id: string }, { user }: { user: JWTPayload}): Promise<IProject> => {
      // verifyPermissions();
      authGuard(user, ['delete:project']);//solo administradores
      try {
        await dbConnect();
        const session = await ProjectModel.startSession();
        session.startTransaction();
        try {
          const deletedProject = await ProjectModel.findByIdAndDelete(id, {
            session,
          }).select('_id').lean<IProject>();
          if (!deletedProject) {
            throw new Error(`Project with id ${id} not found`);
          }
          await AdvanceModel.deleteMany({ project: deletedProject._id });
          await EnrollmentModel.deleteMany({ project: deletedProject._id });
          // await UserModel.updateMany(
          //   //Al ser un arreglo de referencias (ObjectId), no se necesita utilizar { _id: ... }
          //   { assignedProjects: deletedProject._id },
          //   { $pull: { assignedProjects: deletedProject._id } }, // Elimina el ObjectId del arreglo
          //   { session }
          // );

          await session.commitTransaction();
          return deletedProject;
        } catch (error) {
          await session.abortTransaction();
          throw new Error(
            error instanceof Error
              ? `Transaction aborted: ${error.message}`
              : "Transaction aborted due to an unknown error."
          );
        } finally {
          await session.endSession();
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting project: ${error.message}`);
        throw new Error("Failed to delete project due to an unknown error.");
      }
    },
  },
};
