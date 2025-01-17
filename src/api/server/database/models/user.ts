import { Schema, models, model, Document, Types } from "mongoose";
import { IProject } from "./project";
// import { IProject } from "./project";

export type roleAndId = {
  _id: Types.ObjectId;  
  role: ERole;
}

export enum ERole {
  STUDENT = "STUDENT",
  LEADER = "LEADER",
  MANAGER = "MANAGER",
}

export enum EState {
  PENDING = "PENDING",
  AUTHORIZED = "AUTHORIZED",
  UNAUTHORIZED = "UNAUTHORIZED",
}

// Quizá debe de existir atributo projects: string[] | Types.ObjectId[]; Ref: 'Project'
export interface ICreateUser {
  email: string;
  idCard: string;
  name: string;
  surname: string;
  role: ERole;
  state?: EState;
}

export interface IUpdateUser {
  email?: string;
  idCard?: string;
  name?: string;
  surname?: string;
  role?: ERole;
  state?: EState;
}

// Definimos la interfaz para el modelo de usuario
export interface IUser extends ICreateUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  state: EState;
  assignedProjects: IProject[];//próposito solo consulta (query no mutation)
  // deleted: boolean;
}
// const usuario = await UserModel.find({_id; id});
// ucuario.state = EState.STUDENT;
// await usuario.save();

const validateEmail = function (email: string): boolean {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // Devuelve true si el email coincide con la regex, false si no
  return re.test(email);
};

// Declaramos el esquema y modelo fuera de la función GET para evitar crear un nuevo modelo en cada solicitud.
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      maxlength: 100,
      minlength: 1,
    },
    surname: {
      type: String,
      lowercase: true,
      required: true,
      maxlength: 100,
      minlength: 1,
    },
    idCard: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      minlength: 7,
      trim: true,
      match: [/^\d+$/, "ID Card should only contain numbers"],
    },
    email: {
      type: String, // tipo string de propio de mongoose
      required: true, // true
      unique: true,
      maxlength: 100,
      minlength: 10,
      trim: true, // elimina los espacio en blanco ingresados en la cadena email
      validate: [validateEmail, "Please fill a valid email address"],
    },
    role: {
      type: String,
      required: true,
      uppercase: true,
      enum: ERole,
    },
    state: {
      type: String,
      uppercase: true,
      enum: EState,
      default: EState.PENDING,
    },
    assignedProjects: {// Cada que user se asigna a un proyecto con cualquier role aqui se pone _id
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
      default: [],
    },
    // deleted: {
    //   type: Boolean,
    //   default: false,
    // }
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // }
  },
  { timestamps: true },
  // { collection: "users" }
);

// const StudentSchema = new Schema<IUser>().add(UserSchema.obj);
// const LeaderSchema = new Schema<IUser>().add(UserSchema.obj);
// const ManagerSchema = new Schema<IUser>().add(UserSchema.obj);
// // StudentSchema.add({
// //   grade: { type: String, required: true },
// // });
// export const StudentModel = models.Student || model<IUser>('Student', StudentSchema);
export const UserModel = models.User || model<IUser>("User", UserSchema, "users");
