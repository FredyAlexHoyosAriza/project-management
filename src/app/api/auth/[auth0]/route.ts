// Este endpoint se encarga de toda la lógica de autenticación.
import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = await handleAuth();
export const POST = await handleAuth();

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { handleAuth, handleCallback, CallbackOptions } from '@auth0/nextjs-auth0';

// /**
//  * Extendemos las opciones del callback para permitir la propiedad `returnTo`
//  */
// interface ExtendedCallbackOptions extends CallbackOptions {
//   returnTo?: string;
// }

// /**
//  * Type guard para identificar errores provenientes de Auth0
//  */
// function isAuth0Error(error: unknown): error is { status?: number; message: string } {
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'message' in error &&
//     typeof (error as { message: unknown }).message === 'string'
//   );
// }

// /**
//  * Handler de autenticación que redefine el comportamiento del callback.
//  * Se utiliza `NextApiRequest` y `NextApiResponse` para mantener la integración
//  * con la librería @auth0/nextjs-auth0, sin recurrir a `any`.
//  */
// export const GET = async (req: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
//     // Como handleAuth retorna un handler compatible con Next.js,
//     // se lo invoca y se devuelve la respuesta.
//   return handleAuth({
//     async callback(req: NextApiRequest, res: NextApiResponse): Promise<void> {
//       try {
//         const options: ExtendedCallbackOptions = {
//           returnTo: '/admin',
//         };
//         await handleCallback(req, res, options);
//       } catch (error: unknown) {
//         if (isAuth0Error(error)) {
//           res.status(error.status ?? 500).end(error.message);
//         } else {
//           res.status(500).end('Unexpected error');
//         }
//       }
//     },
//   })(req, res);
// }

// export const POST = GET;

// ¿Qué Hace handleAuth en /api/auth/[auth0]?---------------------------------
// El handleAuth de Auth0 simplifica el proceso de autenticación en Next.js. Aquí está lo que hace:

// Login (/api/auth/login):
// Redirige al usuario a la página de inicio de sesión de Auth0. Después de autenticarse exitosamente, Auth0 redirige de vuelta a tu aplicación con un token de acceso.

// Logout (/api/auth/logout):
// Cierra la sesión del usuario y elimina las cookies de sesión.

// Callback (/api/auth/callback):
// Auth0 redirige aquí después de una autenticación exitosa. Este endpoint procesa el token, lo valida y almacena la sesión en una cookie segura.

// User Info (/api/auth/me):
// Devuelve los datos del usuario autenticado, utilizando la sesión almacenada.

// Flujo Completo de Autenticación y Acceso a /api/graphql----------------------------------------
// El Usuario Inicia Sesión:

// El frontend redirige al usuario a /api/auth/login.
// Auth0 maneja la autenticación.
// Después del login exitoso, Auth0 redirige al usuario a /api/auth/callback, donde se almacena la sesión.
// El Usuario Intenta Acceder a /api/graphql:

// El middleware intercepta la solicitud y verifica si la sesión está activa (mediante la cookie que handleAuth configuró).
// Si la sesión es válida, permite el acceso a GraphQL.
// Si no hay sesión, redirige automáticamente al login (/api/auth/login).
// Consultas de GraphQL Autenticadas:

// Ahora que el middleware garantiza que el usuario está autenticado, puedes acceder a /api/graphql sin preocuparte por verificar tokens manualmente.