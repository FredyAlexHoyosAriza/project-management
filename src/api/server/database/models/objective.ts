import { Schema, Types } from "mongoose";

export enum EObjectiveType {
  GENERAL = "GENERAL",
  SPECIFIC = "SPECIFIC",
}

export interface ICreateObjective {
  description: string;
  type: EObjectiveType;
}

export interface IUpdateObjective {
  description?: string;
  type?: EObjectiveType;
  _id?: string;//sin _id creación, con _id eliminación
}

export interface IObjective extends ICreateObjective, Document {
  updatedAt: Date;
  createdAt: Date;
  _id: Types.ObjectId;
}

export const ObjectiveSchema = new Schema<ICreateObjective>(
  {
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: EObjectiveType,
      required: true,
    },
  },
  { timestamps: true, _id: true }
); //opciones de confi solo disponibles desde en schema
