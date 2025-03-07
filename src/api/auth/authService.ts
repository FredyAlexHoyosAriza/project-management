import { JWTPayload } from "jose";
import { ERole, EState } from "../database/models/user";
import { GraphQLError } from "graphql";

const checkScope = (tokenScope: string[], neededScope: string[]) => {
    return neededScope.every(scope => tokenScope.includes(scope));
};

export const authGuard = (admittedRoles: string, user?: JWTPayload) => {
  if (!user) {
    throw new GraphQLError("Unauthorized: Invalid token", {
      extensions: { code: "UNAUTHENTICATED" }, //code: 401
    });
  }

  if (user.gty) {
    // const scope = user.scope as string;
    const scope = (user.scope as string).split(' ');
    const neededScope = process.env.AUTH0_REGISTER_SCOPE!.split(' ');
    if (checkScope(scope, neededScope)) return;
    else {
      throw new GraphQLError("Forbidden: Insufficient scopes", {
        extensions: { code: "FORBIDDEN" } //code: 403
      });
    }
  } // token de app no de usuario

  if (user.state !== EState.AUTHORIZED) {
    console.log('Dentro de verificación de estado');
    throw new GraphQLError('Unauthorized: UNAUTHORIZED state', {
      extensions: { code: 'UNAUTHORIZED'}
    });
  }
  // Extraer scopes del token JWT
  // const tScope = (user?.scope as string)?.split(" ") || [];
  const tRole = user.role as ERole;
  if (!admittedRoles.includes(tRole)) {
    throw new GraphQLError("Forbidden: Insufficient scopes", {
      extensions: { code: "FORBIDDEN" } //code: 403
    });
  }
};
