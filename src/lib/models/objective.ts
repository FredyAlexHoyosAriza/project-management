import { Schema, Types } from 'mongoose';

export enum EObjectiveType {
    general = 'general',
    specific = 'specific',
}

export interface IObjectiveRequest {
    description: string;
    type: EObjectiveType;
}

export interface IObjective extends IObjectiveRequest, Document {
    updatedAt: Date;
    createdAt: Date;
    _id: Types.ObjectId;
}

export const ObjectiveSchema = new Schema<IObjectiveRequest>({
    description: {
        type: String,
        required: true,
        maxlength: 500,
    },
    type: {
        type: String,
        enum: EObjectiveType,
        required: true,
    }
}, { timestamps: true, _id: true, })//opciones de confi solo disponibles desde en schema