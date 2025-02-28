import { dbConnect } from "@/api/database/mongoose";
import { EnrollmentModel, IUpdateEnrollment } from "@/api/database/models/enrollment";
import { IEnrollment, ICreateEnrollment } from "@/api/database/models/enrollment";
import { ProjectModel } from "../../database/models/project";
import { ERole } from "../../database/models/user";
import { verifyUser } from "../user/services";
import { handleAcceptance } from "./services";
import { authGuard } from "../authService";
import { JWTPayload } from "jose";

export const enrollmentResolvers = {
  Query: {
    // Obtener todas las inscripciones
    getEnrollments: async (_parent: unknown, _args: unknown, { user }: { user: JWTPayload }): Promise<IEnrollment[]> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER + ERole.MANAGER);
      try {
        await dbConnect();
        return await EnrollmentModel.find()
          .populate({
            path: "project",
            select: "name",
            populate: {
              path: "leader",
              select: "name surname",
            },
          })
          .populate("student", "name surname")
          .lean<IEnrollment[]>();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching enrollments: ${error.message}`);
        throw new Error("Failed to fetch enrollments due to an unknown error.");
      }
    },

    // Obtener una inscripción por ID
    getEnrollmentById: async (_: unknown, { id }: { id: string }, { user }: { user: JWTPayload }): Promise<IEnrollment> => {
      authGuard(user, ERole.STUDENT + ERole.LEADER + ERole.MANAGER);
      try {
        await dbConnect();
        const enrollment = await EnrollmentModel.findById(id)
          .populate({
            path: "project",
            select: "name objectives budget isActive phase startDate finishDate updatedAt",
            populate: {
              path: "leader",
              select: "name surname email idCard state updatedAt",
            },
          })
          .populate("student", "name surname email idCard state updatedAt")
          .lean<IEnrollment>();
        if (!enrollment) {
          throw new Error(`Enrollment with ID ${id} not found`);
        }
        return enrollment;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching the enrollment: ${error.message}`);
        throw new Error(`Failed to fetch the enrollment due to an unknown error.`);
      }
    },
  },

  Mutation: {
    // Crear una nueva inscripción
    createEnrollment: async (_: unknown, { input }: { input: ICreateEnrollment }, { user }: { user: JWTPayload }): Promise<IEnrollment> => {
      try {
        await dbConnect();
        authGuard(user, ERole.STUDENT);
        await verifyUser(<string>input.student, ERole.STUDENT);
        let newEnrollment: IEnrollment = new EnrollmentModel(handleAcceptance(input, true));
        // Aplicar operaciones en pasos separados
        const session = await EnrollmentModel.startSession();
        session.startTransaction();
        try {
          newEnrollment =  await newEnrollment.save({ session });
          await ProjectModel.updateOne(
            {_id: input.project },
            { $addToSet: { enrollments: newEnrollment._id } },
            { session }
          );
          // await UserModel.updateOne(
          //   {_id: input.student },
          //   { $addToSet: { assignedProjects: newEnrollment._id } },
          //   { session }
          // );
          await session.commitTransaction();// transacción aprobada para DB
          return newEnrollment;
        } catch (error) {
          await session.abortTransaction(); //Se abortan todos los cambios en DB
          throw error;
        } finally {          
          session.endSession();// Finalizar la sesión
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) 
          throw new Error(`Error creating enrollment: ${error.message}`);
        throw new Error("Failed to create enrollment due to an unknown error.");
      }
    },

    // Actualizar una inscripción existente
    updateEnrollment: async (
      _: unknown,
      { id, input }: { id: string; input: IUpdateEnrollment }, { user }: { user: JWTPayload } //: Partial<IEnrollment>
    ): Promise<IEnrollment> => {
      authGuard(user, ERole.LEADER + ERole.MANAGER);
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("the update object is empty.");
        }
        await dbConnect();        

        const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate<IEnrollment>(
          id,
          handleAcceptance(input, false),
          { new: true, runValidators: true } // Asegura validaciones al actualizar
        ).lean<IEnrollment>();
        
        if (!updatedEnrollment) {
          throw new Error(`Enrollment with ID ${id} not found.`);
        }
        return updatedEnrollment;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error updating enrollment: ${error.message}`);
        throw new Error("Failed to update enrollment due to an unknown error.");
      }
    },

    // Eliminar una inscripción
    deleteEnrollment: async (_: unknown, { id }: { id: string }, { user }: { user: JWTPayload }): Promise<IEnrollment> => {
      authGuard(user, ERole.LEADER + ERole.MANAGER);
      try {
        await dbConnect();
        const session = await EnrollmentModel.startSession();
        session.startTransaction();
        try {
          const deletedEnrollment = await EnrollmentModel.findByIdAndDelete(id, { session }).lean<IEnrollment>();
          if (!deletedEnrollment) {
            throw new Error(`Enrollment with ID ${id} not found`);
          }
          await ProjectModel.updateOne(
            {_id: deletedEnrollment.project },
            { $pull: { enrollments: { _id: id } } },
            { session }
          );
          // await UserModel.updateOne(
          //   {_id: deletedEnrollment.student },
          //   { $pull: { assignedProjects: { _id: id } } },
          //   { session }
          // );
          await session.commitTransaction();
          return deletedEnrollment;
        } catch (error) {
          await session.abortTransaction();
          throw new Error(
            error instanceof Error
              ? `Error in atomic operaticon; transaction aborted: ${error.message}`
              : "Transaction aborted due to an unknown error."
          );
        } finally {
          session.endSession();
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting enrollment: ${error.message}`);
        throw new Error("Failed to delete enrollment due to an unknown error.");
      }
    },
  },
};
