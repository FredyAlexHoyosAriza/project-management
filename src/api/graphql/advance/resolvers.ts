import { dbConnect } from "@/api/database/mongoose";
import { AdvanceModel } from "@/api/database/models/advance";
import {
  IAdvance,
  ICreateAdvance,
  IUpdateAdvance,
} from "@/api/database/models/advance";
import { IProjectEnrollments, ProjectModel } from "../../database/models/project";
import { ERole, EState } from "@/api/database/models/user";
import { JWTPayload } from "jose";
import { authGuard } from "../authService";
import { verifyProject } from "../project/services";

export const advanceResolvers = {
  Query: {
    // Obtener todos los avances
    getAdvances: async (_parent: unknown, _args: unknown, { user }: { user: JWTPayload }): Promise<IAdvance[]> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER + ERole.MANAGER);
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
      _: unknown,
      { id }: { id: string }, { user }: { user: JWTPayload }
    ): Promise<IAdvance> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER + ERole.MANAGER);
      try {
        await dbConnect();
        const advance = await AdvanceModel.findById(id)
          .populate({
            path: "project",
            select:
              "name objectives budget isActive phase startDate finishDate updatedAt",
            populate: {
              path: "leader",
              select: "name surname email idCard state updatedAt",
            },
          })
          .populate("student", "name surname email idCard state updatedAt")
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
      _: unknown,
      { input }: { input: ICreateAdvance }, { user }: { user: JWTPayload }
    ): Promise<IAdvance> => {
      authGuard(user, ERole.STUDENT);
      try {
        await dbConnect();
        // el estudiante debe estar inscrito y aceptado en el proyecto para el que hace el avance
        // query = { _id: projectId, enrollments: [{ _id: enrollmentId, student: studentId, isAccpeted: true }] }
        // const { enrollments } = await ProjectModel.findById(input.project)
        //   .select("enrollments")
        //   .populate({
        //     path: "enrollments",
        //     select: "isAccepted",
        //     populate: {
        //       path: "student",
        //       select: "state",
        //     },
        //   });
        // if (enrollments) {
        //   // al encontrar, some retorna true
        //   if (
        //     !enrollments.some(
        //       ({ student, isAccepted }: {
        //         student: { _id: Types.ObjectId; state: EState };
        //         isAccepted: boolean;
        //       }) =>
        //         student.toString() === input.student &&
        //         isAccepted &&
        //         student.state === EState.AUTHORIZED
        //     )
        //   ) {
        //     throw new Error(
        //       `Student ID ${input.student} not enrolled or not accepted in project ID ${input.project}`
        //     );
        //   }
        // } else {
        //   throw new Error(`Project ID ${input.project} does not exist in the database.`);
        // }

        const project = await ProjectModel.findOne({ _id: input.project, isActive: true })
        .select("enrollments")
        .populate({
          path: "enrollments",
          match: { isAccepted: true }, // Filtra solo inscripciones aceptadas
          select: "_id",// solo se trae _id
          populate: {// students que incumplan filtro serán null
            path: "student",
            match: { _id: input.student, state: EState.AUTHORIZED }, // Filtra estudiantes autorizados
            select: "_id", // Solo recupera el ID del estudiante
          },
        }).lean<IProjectEnrollments>();
        if (!project) {
          throw new Error(`Project ID ${input.project} does not exist in the database or isn't active.`);
        }
        const { enrollments } = project;
        if (!enrollments.some(({ student }) => student)) {
          throw new Error(`Student ID ${input.student} not enrolled or not accepted in project ID ${input.project} or simply not authorized in app`)
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
      _: unknown,
      { id, input }: { id: string; input: IUpdateAdvance }, { user }: { user: JWTPayload }
    ): Promise<IAdvance> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER);
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("the update object is empty.");
        }
        await dbConnect();
        verifyProject(input.project)
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
      _: unknown,
      { id }: { id: string }, { user }: { user: JWTPayload }
    ): Promise<IAdvance> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER);
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
