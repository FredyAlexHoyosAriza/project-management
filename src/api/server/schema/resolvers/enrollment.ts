import { dbConnect } from "@/api/server/database/mongoose";
import { EnrollmentModel, IUpdateEnrollment } from "@/api/server/database/models/enrollment";
import { IEnrollment, ICreateEnrollment } from "@/api/server/database/models/enrollment";

export const enrollmentResolvers = {
  Query: {
    // Obtener todas las inscripciones
    getEnrollments: async () => {
      try {
        await dbConnect();
        return await EnrollmentModel.find()
          .populate("project", "name")
          .populate("student", "name")
          .lean();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching enrollments: ${error.message}`);
        throw new Error("Failed to fetch enrollments due to an unknown error.");
      }
    },

    // Obtener una inscripción por ID
    getEnrollmentById: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const enrollment = await EnrollmentModel.findById(id)
          .populate("project", "name")
          .populate("student", "name")
          .lean();
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
    createEnrollment: async (_: any, { input }: { input: ICreateEnrollment }) => {
      try {
        await dbConnect();
        const newEnrollment: IEnrollment = new EnrollmentModel(input);
        await newEnrollment.save();
        return newEnrollment
      } catch (error) {
        console.error(error);
        if (error instanceof Error) 
          throw new Error(`Error creating enrollment: ${error.message}`);
        throw new Error("Failed to create enrollment due to an unknown error.");
      }
    },

    // Actualizar una inscripción existente
    updateEnrollment: async (
      _: any,
      { id, input }: { id: string; input: IUpdateEnrollment }//: Partial<IEnrollment>
    ) => {
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("El objeto de actualización esta vacío.");
        }
        await dbConnect();
        const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true } // Asegura validaciones al actualizar
        ).lean();
        
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
    deleteEnrollment: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const deletedEnrollment = await EnrollmentModel.findByIdAndDelete(id);
        if (!deletedEnrollment) {
          throw new Error(`Enrollment with ID ${id} not found`);
        }
        return true;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting enrollment: ${error.message}`);
        throw new Error("Failed to delete enrollment due to an unknown error.");
      }
    },
  },
};
