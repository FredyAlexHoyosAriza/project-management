import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/server/schema';
import { NextRequest } from 'next/server';
// import cors from "cors";
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

// En la arquitectura MVC este archivo representaría una VISTA de un solo endpoint
// Inicialización del servidor Apollo
const server = new ApolloServer({ schema
  ,introspection: true,//permite uso apollo sandbox
    plugins: [
      ApolloServerPluginUsageReporting(),//permite registro de métricas; estadística
      ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Activa el sandbox incluso en producción; vercel despliegue
    ],
 });
const handler = startServerAndCreateNextHandler(server);
// const allowedOrigins = ['https://studio.apollographql.com']; // Dominios permitidos
// const corsOptions = {
//   origin: allowedOrigins,
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// // Inicializa CORS correctamente
// const corsMiddleware = cors(corsOptions);

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req, res) => {
//     return new Promise((resolve, reject) => {
//       corsMiddleware(req, res, (err) => {
//         if (err) return reject(err);
//         resolve({ req, res });
//       });
//     });
//   },
// });

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req, res) => {
//     // Configurar CORS
//     cors({
//       origin: allowedOrigins, // Solo Apollo Studio
//       methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
//       allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
//     })(req, res, () => {});
//     return { req, res };
//   },
// });
// Rutas GET y POST para el endpoint GraphQL
// Ir a la ruta http://localhost:3000/api/graphql implica hacer un GET al endpoint:
// El metodo GET se requiere para abrir el Apollo SANDBOX
export async function GET(req: NextRequest): Promise<Response> {
  return handler(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req);
}
