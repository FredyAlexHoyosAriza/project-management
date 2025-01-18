import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/server/schema';
import { NextRequest } from 'next/server';
import cors from "cors";

// En la arquitectura MVC este archivo representaría una VISTA de un solo endpoint
// Inicialización del servidor Apollo
// const server = new ApolloServer({ schema,
//   introspection: true,//permite uso apollo sandbox
//   plugins: [
//     ApolloServerPluginUsageReporting(),//permite registro de métricas; estadística
//     ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Activa el sandbox incluso en producción; vercel despliegue
//   ],
// });
const server = new ApolloServer({ schema,
  introspection: true
 });
// const handler = startServerAndCreateNextHandler(server);
const allowedOrigins = ['https://studio.apollographql.com']; // Dominios permitidos

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // Configurar CORS
    cors({
      origin: allowedOrigins, // Solo Apollo Studio
      methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    })(req, res, () => {});
    return { req, res };
  },
});
// Rutas GET y POST para el endpoint GraphQL
// Ir a la ruta http://localhost:3000/api/graphql implica hacer un GET al endpoint:
// El metodo GET se requiere para abrir el Apollo SANDBOX
export async function GET(req: NextRequest): Promise<Response> {
  return handler(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req);
}
