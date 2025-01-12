import { dbConnect } from "@/api/server/database/mongoose";
import { AdvanceModel } from "@/api/server/database/models/advance";
import {
  IAdvance,
  ICreateAdvance,
  IUpdateAdvance,
} from "@/api/server/database/models/advance";

export const advanceResolvers = {
  Query: {
    // Obtener todos los avances
    getAdvances: async () => {
      try {
        await dbConnect();
        return await AdvanceModel.find()
          .populate("project", "name")
          .populate("student", "name")
          .lean();
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error fetching advances: ${error.message}`);
        throw new Error("Failed to fetch advances due to an unknown error.");
      }
    },
    // Obtener un avance por su ID
    getAdvanceById: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const advance = await AdvanceModel.findById(id)
          .populate("project", "name")
          .populate("student", "name")
          .lean();
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
    createAdvance: async (_: any, { input }: { input: ICreateAdvance }) => {
      try {
        await dbConnect();
        const newAdvance: IAdvance = new AdvanceModel(input);
        await newAdvance.save();
        return newAdvance
      } catch (error) {
        console.error(error);
        if (error instanceof Error) 
          throw new Error(`Error creating advance: ${error.message}`);
        throw new Error("Failed to create advance due to an unknown error.");//throw error;
      }
    },

    // Actualizar un avance existente // Partial<IAdvance>
    updateAdvance: async (
      _: any,
      { id, input }: { id: string; input: IUpdateAdvance }
    ) => {
      try {
        if (Object.keys(input).length === 0) {
          throw new Error("El objeto de actualización esta vacío.");
        }
        await dbConnect();
        const updatedAdvance = await AdvanceModel.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        ).lean();
        
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
    deleteAdvance: async (_: any, { id }: { id: string }) => {
      try {
        await dbConnect();
        const deletedAdvance = await AdvanceModel.findByIdAndDelete(id);
        if (!deletedAdvance) {
          throw new Error(`Advance with ID ${id} not found.`);
        }
        return true;
      } catch (error) {
        console.error(error);
        if (error instanceof Error)
          throw new Error(`Error deleting advance: ${error.message}`);
        throw new Error("Failed to delete advance due to an unknown error.");
      }
    },
  },
};
