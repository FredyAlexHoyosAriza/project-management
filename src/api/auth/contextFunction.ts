import { NextRequest } from "next/server";
import { jwtVerify, importJWK, JWTPayload, KeyLike, JWK } from "jose";

const auth0Alg = process.env.AUTH0_TOKEN_SIGNING_ALG!;
const auth0Issuer = `${process.env.AUTH0_ISSUER_BASE_URL!}/`;
const auth0Audience = process.env.AUTH0_AUDIENCE!;
// Cache de la clave pública
let cachedPublicKey: KeyLike | null = null;
// Función para obtener y almacenar la clave pública desde Auth0
const getPublicKey = async (): Promise<KeyLike> => {
  if (!cachedPublicKey) {
    const res = await fetch(
      `${auth0Issuer}.well-known/jwks.json`
    );
    const { keys } = (await res.json()) as { keys: JWK[] };
    if (!keys.length) throw new Error("No keys found in JWKS");
    const importedKey = await importJWK(keys[0], auth0Alg);

    if (!(importedKey instanceof Uint8Array)) {
      cachedPublicKey = importedKey;
    } else {
      throw new Error("Imported key is not a valid KeyLike");
    }
  }
  return cachedPublicKey;
};

// Función de verificación de token y obtención de usuario
const verifyToken = async (token: string): Promise<JWTPayload | undefined> => {
  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: [auth0Alg],
      issuer: auth0Issuer,
      audience: auth0Audience!,
    });
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return undefined; // Ahora solo devuelve undefined (no null)
  }
};

// Contexto de Apollo con validación de token
export const contextFunction = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: undefined };
  }

  const token = authHeader.split(" ")[1];
  const user = await verifyToken(token);

  return { user };  // Retornar scopes en el contexto
};

// import { NextRequest } from "next/server";
// import { jwtVerify, importJWK, JWTPayload, KeyLike, JWK } from "jose";

// const auth0Alg = process.env.AUTH0_TOKEN_SIGNING_ALG!;
// const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

// // Caché para la clave pública y usuarios verificados
// let cachedPublicKey: KeyLike | null = null;
// const tokenCache = new Map<string, { user: JWTPayload; expiresAt: number }>();

// // Función para obtener y almacenar la clave pública desde Auth0
// const getPublicKey = async (): Promise<KeyLike> => {
//   if (!cachedPublicKey) {
//     const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL!}/.well-known/jwks.json`);
//     const { keys } = (await res.json()) as { keys: JWK[] };
//     if (!keys.length) throw new Error("No keys found in JWKS");

//     const importedKey = await importJWK(keys[0], auth0Alg);
//     if (!(importedKey instanceof Uint8Array)) {
//       cachedPublicKey = importedKey;
//     } else {
//       throw new Error("Imported key is not a valid KeyLike");
//     }
//   }
//   return cachedPublicKey;
// };

// // Función de verificación de token con caché
// const verifyToken = async (token: string): Promise<JWTPayload | undefined> => {
//   const cachedEntry = tokenCache.get(token);
//   const now = Date.now();

//   if (cachedEntry && cachedEntry.expiresAt > now) {
//     console.log("Usando usuario cacheado");
//     return cachedEntry.user;
//   }

//   try {
//     const publicKey = await getPublicKey();
//     const { payload } = await jwtVerify(token, publicKey, {
//       algorithms: [auth0Alg],
//       issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`!,
//       audience: process.env.AUTH0_AUDIENCE!,
//     });

//     tokenCache.set(token, { user: payload, expiresAt: now + CACHE_TTL_MS });

//     return payload;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return undefined;
//   }
// };

// // Contexto de Apollo con validación de token y caché
// export const contextFunction = async (req: NextRequest) => {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return { user: undefined };
//   }

//   const token = authHeader.split(" ")[1];
//   const user = await verifyToken(token);

//   console.log("Imprimiendo el usuario: ", user);

//   return { user };
// };

