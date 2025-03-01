import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';
import { jwtDecode } from 'jwt-decode';
import { customJwtPayload } from './types/user';
// import { ERole } from './api/database/models/user';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Permitir el acceso al landing page sin autenticación
  if (pathname === '/' || pathname === '/index.html') {
    return NextResponse.next();
  }

  // 2. Delegar el manejo a las rutas de /auth (login, callback, etc.)
  if (pathname.startsWith('/auth')) {
    return auth0.middleware(request);
  }

  // 3. Verificar si existe una sesión activa
  const session = await auth0.getSession();//request as any
  if (!session) {
    // Si no hay sesión, redirigir al login.
    // Puedes agregar el parámetro "returnTo" para volver a la ruta actual tras loguearse.
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = jwtDecode<customJwtPayload>(session.tokenSet.accessToken)[
    "http://localhost/userInfo"
  ].role

  // Proteger la ruta /admin/users (solo "admin" puede acceder)
  if (pathname.startsWith("/admin/users") && role !== 'MANAGER' && role !== 'LEADER') {
    const previousUrl = request.headers.get("referer") || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/admin`; // Si no hay referer, redirige a /admin
    return NextResponse.redirect(previousUrl); // Redirigir a la ruta anterior
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
    '/((?!_next/static|project-management-1.png|Project-Management-Landing-2.jpg|_next/image|favicon.ico|sitemap.xml|robots.txt|api/).*)',
  ],
};
