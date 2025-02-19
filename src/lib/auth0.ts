import { Auth0Client } from "@auth0/nextjs-auth0/server";
// import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  signInReturnToPath: "/admin ",
    authorizationParameters: {
      scope: "openid profile email read:data write:data",
      audience: process.env.AUTH0_AUDIENCE,
    },
//   async onCallback(error, context) {//, session
//     // redirect the user to a custom error page
//     if (error) {
//       return NextResponse.redirect(
//         new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL)
//       );
//     }

//     // Complete the redirect to the provided returnTo URL
//     return NextResponse.redirect(
//       new URL(context.returnTo || "/admin", process.env.APP_BASE_URL)
//     );
//   },
  session: {
    rolling: true,
    absoluteDuration: 60 * 60 * 24 * 30, // 30 days in seconds
    inactivityDuration: 60 * 60 * 24 * 7, // 7 days in seconds
  },
});

// En Next.js, gracias a la librería @auth0/nextjs-auth0, no necesitas crear un contexto manualmente.
// Esta librería ya implementa el manejo de sesiones y autenticación usando el Context API de React
// de forma interna, integrado con las capacidades del servidor de Next.js. Cuando usas getSession()
// o useUser() de @auth0/nextjs-auth0, estás accediendo a ese contexto ya creado automáticamente.
