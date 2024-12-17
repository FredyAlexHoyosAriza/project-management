import { dbConnect } from "@/lib/mongoose";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { IEnrollment } from "@/lib/models/enrollment";

export const enrollmentResolvers = {
  Query: {
    // Obtener todas las inscripciones
    getEnrollments: async () => {
      await dbConnect();
      return await EnrollmentModel.find().lean();
    },

    // Obtener una inscripción por ID
    getEnrollmentById: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      return await EnrollmentModel.findById(id).lean();
    },
  },

  Mutation: {
    // Crear una nueva inscripción
    createEnrollment: async (_: any, { input }: { input: IEnrollment }) => {
      await dbConnect();
      const newEnrollment = new EnrollmentModel(input);
      await newEnrollment.save();
      return newEnrollment;
    },

    // Actualizar una inscripción existente
    updateEnrollment: async (
      _: any,
      { id, input }: { id: string; input: Partial<IEnrollment> }
    ) => {
      await dbConnect();
      const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true, // Asegura validaciones al actualizar
      }).lean();
      return updatedEnrollment;
    },

    // Eliminar una inscripción
    deleteEnrollment: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      const deletedEnrollment = await EnrollmentModel.findByIdAndDelete(id);
      return deletedEnrollment ? true : false;
    },
  },
};
