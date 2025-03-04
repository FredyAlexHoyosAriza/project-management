import { Schema, models, model, Document, Types } from "mongoose";

export interface ICreateEnrollment {
  project: string;
  student: string;//string y Types.ObjectId son tipos identificadores MongoDB desde el front-end
  isAccepted?: boolean;
  // entryDate: Date, //automática
  exitDate?: Date;//debe ser posterior a entryDate (comparar)
}

export interface IUpdateEnrollment {
  isAccepted?: boolean;
  // entryDate: Date, //automática
  exitDate?: Date;
}

export interface IEnrollment extends Document {
  _id: Types.ObjectId; // string
  isAccepted: boolean;
  project: Types.ObjectId;
  student: Types.ObjectId;
  exitDate: Date | null;
  entryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>({
  isAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  entryDate: {
    type: Date,
    required: true,
    default: null,
  },
  exitDate: {
      type: Date,
      required: true,
      default: null,
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
  },
},
{ timestamps: true }
);

export const EnrollmentModel =
  models.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);
