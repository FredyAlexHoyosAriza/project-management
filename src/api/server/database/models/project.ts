import { Schema, models, model, Document, Types } from "mongoose";
import {
  // EObjectiveType,
  IObjective,
  ICreateObjective,
  IUpdateObjective,
  ObjectiveSchema,
} from "./objective";

enum EProjectPhase {
  STARTED = "STARTED",
  DEVELOPMENT = "DEVELOPMENT",
  FINISHED = "FINISHED",
  EMPTY = "EMPTY",
}

// enum EProjectState {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE',
// }

export interface ICreateProject {
  name: string;
  leader: string | Types.ObjectId;
  budget: number;
  objectives?: ICreateObjective[]; // IObjective[] ||
  isActive?: boolean;
  phase?: EProjectPhase;
  advances?: string[] | Types.ObjectId[]; // Referencia a la colección "Avance"
  enrollments?: string[] | Types.ObjectId[];
  startDate?: Date;
  finishDate?: Date;
}

export interface IUpdateProject {
  name?: string;
  leader?: string;
  budget?: number;
  isActive?: boolean;
  phase?: EProjectPhase;
  objectives?: IUpdateObjective[];//ICreateObjective
  startDate?: Date;
  finishDate?: Date;
}

export interface IProject extends ICreateProject, Document {
  _id: Types.ObjectId; // string
  createdAt: Date;
  updatedAt: Date;
  leader: Types.ObjectId;
  objectives: IObjective[]; //Usa IObjective[] porque es el estado real de los subdocumentos en tiempo de ejecución.
  advances: Types.ObjectId[]; // IDs de avances relacionados
  enrollments: Types.ObjectId[];
  startDate: Date;
  finishDate: Date;
} //Types.ObjectId.isValid()

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      maxlength: 100,
      minlength: 1,
    },
    leader: {
      //Podría ser un objeto con datos clave del lider, como name e email
      type: Schema.Types.ObjectId,
      ref: "User", // Se hace referencia al modelo "User"
      required: true,
      match: [/^[0-9a-fA-F]{24}$/, "El id debe cumplir el formato de mongo db"],
    },
    budget: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    phase: {
      type: String,
      uppercase: true,
      enum: EProjectPhase,
      default: EProjectPhase.EMPTY,
    },
    // objectives: {
    //   type: [
    //     {
    //       description: {
    //         type: String,
    //         required: true,
    //         maxlength: 500,
    //       },
    //       type: {
    //         type: String,
    //         enum: Object.values(EObjectiveType),
    //         required: true,
    //       },
    //     },
    //   ],
    //   default: [],
    // },
    advances: {
      type: [{ type: Schema.Types.ObjectId, ref: "Advance" }],
      default: [],
    },
    enrollments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Enrollment" }],
      default: [],
    },
    // state: {
    //   type: String,
    //   enum: EProjectState,
    //   default: EProjectState.INACTIVE,
    // },
    objectives: {
      type: [ObjectiveSchema],
      default: [],
    },
    startDate: {
      type: Date,
      default: null,
    },
    finishDate: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true }
);

export const ProjectModel =
  models.Project || model<IProject>("Project", ProjectSchema);

// const project: IProject[] = await ProjectModel.find({
//   _id: "123456789012123456789012",
// });
// (project[0].objectives as ICreateObjective[]).push({ description: "Soy un objetivo general", type: EObjectiveType.general });
// await project[0].save();
// (project[0].objectives as ICreateObjective[]) = [
//   { description: "Soy un objetivo general", type: EObjectiveType.general },
//   { description: "Soy un objetivo especifico", type: EObjectiveType.specific },
// ];
// await project[0].save();

// (project[0].objectives as IObjective[]).forEach((objective) => {
//   console.log("ID:", objective._id);
//   console.log("Created At:", objective.createdAt);
//   console.log("Updated At:", objective.updatedAt);
//   console.log("Description:", objective.description);
// });
// const project = await ProjectModel.findById("123456789012123456789012");

// if (project) {
//   project.objectives.push({
//     description: "Nuevo objetivo general",
//     type: EObjectiveType.general,
//   });
//   await project.save();

//   console.log(project.objectives); // Cada objetivo tendrá _id, createdAt y updatedAt.
// }

// const project = await ProjectModel.findById("123456789012123456789012");
// // Encuentra el subdocumento
// const objective = project.objectives.id("123456789012123456789012");
// // Modifica los campos del subdocumento
// objective.description = "Nueva descripción";
// objective.type = EObjectiveType.general;
// // Guarda los cambios
// await project.save();

// const projectId = new Types.ObjectId("123456789012345678901234");
// const objectiveId = new Types.ObjectId("567890123456789012345678");
// // Actualizar la descripción y el tipo del subdocumento
// await ProjectModel.findOneAndUpdate(
//   { _id: projectId, "objectives._id": objectiveId },
//   {
//     $set: {
//       "objectives.$.description": "Actualizar descripción",
//       "objectives.$.type": EObjectiveType.specific,
//     },
//   },
//   { new: true }
// );

// await ProjectModel.updateOne(
//   { _id: projectId, "objectives._id": objectiveId }, // Filtra el proyecto y el subdocumento
//   {
//     $set: {
//       "objectives.$.description": "Nueva descripción",
//       "objectives.$.type": EObjectiveType.specific,
//     },
//   }
// );

