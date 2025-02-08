// El middleware asegura que las solicitudes a /api/graphql solo pasen si el usuario está autenticado.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export async function middleware(req: NextRequest) {
  const session = await getSession(req, new NextResponse());

  if (!session?.user) {
    // Redirigir al login si no hay sesión activa
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }

  // Permitir el acceso si hay sesión activa
  return NextResponse.next();
}

// Proteger solo la ruta GraphQL
export const config = {
  matcher: '/api/graphql/:path*',
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// // import { handleAuthMiddleware } from './app/api/users/auth';

// // Definir las rutas protegidas
// const protectedRoutes = ["/api/users", "/api/orders"];

// export function middleware(req: NextRequest) {
//   const token = req.headers.get("authorization");

//   // Verificar si la ruta está protegida
//   const url = req.nextUrl.pathname;
//   if (protectedRoutes.some((route) => url.startsWith(route))) {
//     // Validar el token
//     if (!token || !isValidToken(token)) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//   }
//   //   if (req.nextUrl.pathname.startsWith('/api/users')) {
//   //     return handleAuthMiddleware(req);
//   //   }

//   return NextResponse.next();
// }

// // Función para validar el token (ejemplo)
// function isValidToken(token: string): boolean {
//   // Aquí se podría usar un método para verificar el token JWT
//   // Por ejemplo, con una librería como `jsonwebtoken`
//   try {
//     // Ejemplo de validación ficticia
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload && payload.exp > Date.now() / 1000;
//   } catch {// (error)
//     return false;
//   }
// }
