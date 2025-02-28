import { Schema, models, model, Document, Types } from "mongoose";

// Request interface (sin campos de Mongoose, útil para recibir datos en peticiones)
export interface ICreateAdvance {
  project: string | Types.ObjectId; // string en lo que se recibe en las request
  student: string | Types.ObjectId;
  description: string;
  // createdAt?: Date;
}
export interface IUpdateAdvance {
  project: string;
  description?: string;
  leaderRemarks?: string;
}

// Interface completa para documentos almacenados en MongoDB
export interface IAdvance extends ICreateAdvance, Document {
  project: Types.ObjectId; // ObjectId porque en la base de datos es una referencia
  student: Types.ObjectId; // ObjectId por el mismo motivo
  leaderRemarks: string;
  _id: Types.ObjectId; // string
  createdAt: Date;
  updatedAt: Date;
}

export const AdvanceSchema = new Schema<IAdvance>(
  {
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
    },
    leaderRemarks: {
      type: String,
      required: true,
      minlength: 16,
      maxlength: 500,
      default: 'Comming soon ...',
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project", // Hace referencia al modelo "Project"
      required: true,
      match: [/^[0-9a-fA-F]{24}$/, "El id debe cumpler el formato de mongo db"],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User", // Se hace referencia al modelo "User"
      required: true,
      match: [/^[0-9a-fA-F]{24}$/, "El id debe cumpler el formato de mongo db"],
      // validate: {
      //     validator: async (value: Types.ObjectId) => {
      //       const user = await UserModel.findById(value);
      //       return user ? user.role === ERole.student : false;
      //     },
      //     message: "El usuario debe ser un estudiante.",
      //   },
    },
    //   createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
  },
  { timestamps: true }
);

export const AdvanceModel =
  models.Advance || model<IAdvance>("Advance", AdvanceSchema);

//   const advances = await AdvanceModel.find()
//   .populate("project", "name") // Carga solo el campo "name" del proyecto
//   .populate("student", "name email");
