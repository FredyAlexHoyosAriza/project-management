import { NextRequest } from "next/server";
import { jwtVerify, importJWK, JWTPayload, KeyLike, JWK } from "jose";

const auth0Alg = process.env.AUTH0_TOKEN_SIGNING_ALG!;
// Cache de la clave pública
let cachedPublicKey: KeyLike | null = null;
// Función para obtener y almacenar la clave pública desde Auth0
const getPublicKey = async (): Promise<KeyLike> => {
  if (!cachedPublicKey) {
    const res = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL!}/.well-known/jwks.json`
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
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`!,
      audience: process.env.AUTH0_AUDIENCE!,
    });
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return undefined; // 🚀 Ahora solo devuelve undefined (no null)
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
  // console.log(user);
  if (!user) {
    throw new Error("Unauthorized: Invalid token");
  }

  return { user }; // 🚀 Siempre devuelve { user?: JWTPayload } evitando null
};
