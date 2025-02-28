import { JWTPayload } from "jose";
import { ERole } from "../database/models/user";

// const checkScope = (tokenScope: string[], neededScope: string[]) => {
//     return neededScope.every(scope => tokenScope.includes(scope));
// };

export const authGuard = ( user: JWTPayload, admittedRoles: string ) => {
  if (!user) {
    throw new Error(JSON.stringify({ message: "Unauthorized: Invalid token", code: 401 }));
  }
  // Extraer scopes del token JWT
  // const tScope = (user?.scope as string)?.split(" ") || [];
  const tRole = <ERole>user?.role || '';
  if (!admittedRoles.includes(tRole)) {
    throw new Error(JSON.stringify({ message: "Forbidden: Insufficient scopes", code: 401 }));
  }
}


