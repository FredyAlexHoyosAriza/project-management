import { dbConnect } from "@/lib/mongoose";
import { AdvanceModel } from "@/lib/models/advance";
import { IAdvance } from "@/lib/models/advance";

export const advanceResolvers = {
  Query: {
    // Obtener todos los avances
    getAdvances: async () => {
      await dbConnect();
      return await AdvanceModel.find().lean();
    },
    // Obtener un avance por su ID
    getAdvanceById: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      return await AdvanceModel.findById(id).lean();
    },
  },
  Mutation: {
    // Crear un nuevo avance
    createAdvance: async (_: any, { input }: { input: IAdvance }) => {
      await dbConnect();
      const newAdvance = new AdvanceModel(input);
      await newAdvance.save();
      return newAdvance;
    },
    // Actualizar un avance existente
    updateAdvance: async (_: any, { id, input }: { id: string; input: Partial<IAdvance> }) => {
      await dbConnect();
      const updatedAdvance = await AdvanceModel.findByIdAndUpdate(id, input, {
        new: true,
      }).lean();
      return updatedAdvance;
    },
    // Eliminar un avance
    deleteAdvance: async (_: any, { id }: { id: string }) => {
      await dbConnect();
      const result = await AdvanceModel.findByIdAndDelete(id);
      return result ? true : false;
    },
  },
};
