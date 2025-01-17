import { dbConnect } from "@/api/server/database/mongoose";
import { AdvanceModel } from "@/api/server/database/models/advance";
import {
  IAdvance,
  ICreateAdvance,
  IUpdateAdvance,
} from "@/api/server/database/models/advance";
import { IProject, ProjectModel } from "../../database/models/project";
import { Types } from "mongoose";

export const advanceResolvers = {
  Query: {
    // Obtener todos los avances
    getAdvances: async (): Promise<IAdvance[]> => {
      try {
        await dbConnect();
        return await AdvanceModel.find()
          .populate({
            path: "project",
            select: "name",
            populate: {
              path: "leader",
              select: "name surname",
            },
          })
          .populate("student", "name surname")
          .lean<IAdvance[]>();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching advances: ${error.message}`);
        throw new Error("Failed to fetch advances due to an unknown error.");
      }
    },
    // Obtener un avance por su ID
    getAdvanceById: async (
      _: any,
      { id }: { id: string }
    ): Promise<IAdvance> => {
      try {
        await dbConnect();
        const advance = await AdvanceModel.findById(id)
          .populate({
            path: "project",
            select: "name",
            populate: {
              path: "leader",
              select: "name surname",
            },
          })
          .populate("student", "name surname")
          .lean<IAdvance>();
        if (!advance) {
          throw new Error(`Advance with ID ${id} not found`);
        }
        return advance;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching the advance: ${error.message}`);
        throw new Error(`Failed to fetch the advance due to an unknown error.`);
      }
    },
  },
  Mutation: {
    // Crear un nuevo avance
    createAdvance: async (
      _: any,
      { input }: { input: ICreateAdvance }
    ): Promise<IAdvance> => {
      try {
        await dbConnect();
        // el estudiante debe estar inscrito y aceptado en el proyecto para el que hace el avance
        // query = { _id: projectId, enrollments: [{ _id: enrollmentId, student: studentId, isAccpeted: true }] }
        const { enrollments } = await ProjectModel.findById(input.project)
          .select("enrollments")
          .populate("enrollments", "student isAccepted");
        if (enrollments) {
          // al encontrar, some retorna true
          if (
            !enrollments.some(
              ({
                student,
                isAccepted,
              }: {
                student: Types.ObjectId;
                isAccepted: boolean;
              }) => student.toString() === input.student && isAccepted
            )
          ) {
            throw new Error(
              `Student ID ${input.student} not enrolled or not accepted in project ID ${input.project}`
            );
          }
        } else {
          throw new Error("The project does no exist in DB");
        }

        let newAdvance: IAdvance = new AdvanceModel(input);
        // Aplicar operaciones en pasos separados
        const session = await AdvanceModel.startSession();
        session.startTransaction();
        try {
          newAdvance = await newAdvance.save({ session });
          await ProjectModel.updateOne(
            { _id: input.project },
            { $push: { advances: newAdvance._id } },
            { session }
          );
          await session.commitTransaction();
          return newAdvance;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error creating advance: ${error.message}`);
        throw new Error("Failed to create advance due to an unknown error."); //throw error;
      }
    },

    // Actualizar un avance existente // Partial<IAdvance>
    updateAdvance: async (
      _: any,
      { id, input }: { id: string; input: IUpdateAdvance }
    ): Promise<IAdvance> => {
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("the update object is empty.");
        }
        await dbConnect();
        const updatedAdvance = await AdvanceModel.findByIdAndUpdate(id, input, {
          new: true,
          runValidators: true,
        }).lean<IAdvance>();

        if (!updatedAdvance) {
          throw new Error(`Advance with ID ${id} not found.`);
        }
        return updatedAdvance;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error updating advance: ${error.message}`);
        throw new Error("Failed to update advance due to an unknown error.");
      }
    },

    // Eliminar un avance
    deleteAdvance: async (
      _: any,
      { id }: { id: string }
    ): Promise<IAdvance> => {
      try {
        await dbConnect();
        const session = await AdvanceModel.startSession();
        session.startTransaction();
        try {
          const deletedAdvance = await AdvanceModel.findByIdAndDelete(id, {
            session,
          }).lean<IAdvance>();
          if (!deletedAdvance) {
            throw new Error(`Advance with ID ${id} not found.`);
          }
          await ProjectModel.updateOne(
            //?: maneja error si no existe deletedAdvance o project o _id
            { _id: deletedAdvance?.project },
            { $pull: { advances: { _id: id } } },
            { session }
          );
          await session.commitTransaction();
          return deletedAdvance;
        } catch (error) {
          await session.abortTransaction(); //Se abortan todos los cambios en DB
          throw new Error(
            error instanceof Error
              ? `Error in atomic operaticon; transaction aborted: ${error.message}`
              : "Transaction aborted due to an unknown error."
          );
        } finally {
          session.endSession(); // Finalizar la sesión
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting advance: ${error.message}`);
        throw new Error("Failed to delete advance due to an unknown error.");
      }
    },
  },
};
