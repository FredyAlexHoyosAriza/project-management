import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload, USER_INFO_KEY } from "./types/user";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Permitir el acceso al landing page sin autenticación
  if (pathname === "/" || pathname === "/index.html") {
    return NextResponse.next();
  }

  // 2. Delegar el manejo a las rutas de /auth (login, callback, etc.)
  if (pathname.startsWith("/auth")) {
    return auth0.middleware(request);
  }

  // 3. Verificar si existe una sesión activa
  const session = await auth0.getSession(); //request as any
  if (!session) {
    // Si no hay sesión, redirigir al login.
    // Puedes agregar el parámetro "returnTo" para volver a la ruta actual tras loguearse.
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userInfo = jwtDecode<CustomJwtPayload>(session.tokenSet.accessToken)[
    USER_INFO_KEY
  ];

  const getRedirectUrl = (request: NextRequest) =>
    request.headers.get("referer") ||
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/admin`;

  // Rutas que requieren estado "AUTHORIZED"
  const routesByState = [
    "/admin/users",
    "/admin/advances",
    "/admin/projects",
    "/admin/enrollments",
  ];

  if (
    routesByState.some((route) => pathname.startsWith(route)) &&
    userInfo.state !== "AUTHORIZED"
  ) {
    return NextResponse.redirect(getRedirectUrl(request)); // Redirigir a la ruta anterior
  }

  // Rutas que requieren roles específicos
  const routesByRole: Record<string, Set<string>> = {
    "/admin/users": new Set(["MANAGER", "LEADER"]),
  };

  const requiredRoles = Object.entries(routesByRole).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  if (requiredRoles && !requiredRoles.has(userInfo.role)) {
    return NextResponse.redirect(getRedirectUrl(request));
  }

  // Si está autenticado, permite continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Se aplica a todas las rutas, excepto las que empiecen con:
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico, sitemap.xml, robots.txt (archivos de metadatos)
     */
    "/((?!_next/static|project-management-1.png|Project-Management-Landing-2.jpg|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)",
  ],
};
