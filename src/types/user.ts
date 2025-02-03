// src/types/user.ts
export interface User {
  _id: string;
  name?: string;
  surname?: string;
  idCard?: string;
  email?: string;
  role?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
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