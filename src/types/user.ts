// src/types/user.ts

// type Role = "STUDENT" | "LEADER" | "MANAGER";
// type State = "AUTHORIZED" | "UNAUTHORIZED" | "PENDING";
export interface User {
  _id: string;
  name?: string;
  surname?: string;
  idCard?: string;
  email?: string;
  role: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUser {
  name?: string;
  surname?: string;
  idCard?: string;
  email?: string;
  role?: string;
  state?: string;
}

//ReactState es un alias que representa el tipo del setter de estado que gestiona un booleano
// type ReactState = React.Dispatch<React.SetStateAction<boolean>>;
export interface UserTableProps {
  listaUsuarios: User[];
  // setShouldGetUsers: ReactState;
}

export interface UserRowProps {
  // key: string;
  user: User;
}

export const Role: Record<string, string> = {
  STUDENT: 'estudiante',
  LEADER: 'líder',
  MANAGER: 'administrador',
}

export const State: Record<string, string> = {
  AUTHORIZED: 'autorizado',
  UNAUTHORIZED: 'no autorizado',
  PENDING: 'pendiente'
}

export type customJwtPayload = {
  "http://localhost/userInfo": { role: string, state: string };
};

// export const stateOptions = [
//   { value: "", label: "Seleccione un rol", disabled: true },
//   { value: "AUTHORIZED", label: "autorizado" },
//   { value: "UNAUTHORIZED", label: "no autorizado" },
//   { value: "PENDING", label: "pendiente" },
// ]