// lib/auth.ts
import { initAuth0 } from '@auth0/nextjs-auth0';

export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.AUTH0_BASE_URL!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

// En Next.js, gracias a la librería @auth0/nextjs-auth0, no necesitas crear un contexto manualmente.
// Esta librería ya implementa el manejo de sesiones y autenticación usando el Context API de React
// de forma interna, integrado con las capacidades del servidor de Next.js. Cuando usas getSession()
// o useUser() de @auth0/nextjs-auth0, estás accediendo a ese contexto ya creado automáticamente.
