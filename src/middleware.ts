// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { handleAuthMiddleware } from './app/api/users/auth';

// Definir las rutas protegidas
const protectedRoutes = ["/api/users", "/api/orders"];

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization");

  // Verificar si la ruta está protegida
  const url = req.nextUrl.pathname;
  if (protectedRoutes.some((route) => url.startsWith(route))) {
    // Validar el token
    if (!token || !isValidToken(token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }
  //   if (req.nextUrl.pathname.startsWith('/api/users')) {
  //     return handleAuthMiddleware(req);
  //   }

  return NextResponse.next();
}

// Función para validar el token (ejemplo)
function isValidToken(token: string): boolean {
  // Aquí podrías usar un método para verificar el token JWT
  // Por ejemplo, con una librería como `jsonwebtoken`
  try {
    // Ejemplo de validación ficticia
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload && payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
}
