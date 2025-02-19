import { JWTPayload } from "jose";

const checkScope = (tokenScope: string[], neededScope: string[]) => {
    return neededScope.every(scope => tokenScope.includes(scope));
};

export const authGuard = ( user: JWTPayload, neededScope: string[] ) => {
  if (!user) {
    throw new Error(JSON.stringify({ message: "Unauthorized: Invalid token", code: 401 }));
  }
  // Extraer scopes del token JWT
  const tScope = (user?.scope as string)?.split(" ") || [];
  if (!checkScope(tScope, neededScope)) {
    throw new Error(JSON.stringify({ message: "Forbidden: Insufficient scopes", code: 401 }));
  }
}


