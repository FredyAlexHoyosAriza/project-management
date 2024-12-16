import { Schema, models, model, Document, Types } from "mongoose";

export interface IEnrollmentRequest {
  project: string | Types.ObjectId;
  student: string | Types.ObjectId;//string y Types.ObjectId son tipos identificadores MongoDB desde el front-end
  isAccepted?: boolean;
  entryDate: Date,
  exitDate: Date;
}

export interface IEnrollment extends IEnrollmentRequest, Document {
  _id: Types.ObjectId; // string
  createdAt: Date;
  updatedAt: Date;
  project: Types.ObjectId;
  student: Types.ObjectId;
}

const EnrollmentSchema = new Schema<IEnrollment>({
  isAccepted: {
    type: Boolean,
    default: false,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  exitDate: {
      type: Date,
      required: true,
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