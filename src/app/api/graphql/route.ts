import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/server/schema';
import { NextRequest } from 'next/server';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

// En la arquitectura MVC este archivo representaría una VISTA de un solo endpoint
// Inicialización del servidor Apollo
// const server = new ApolloServer({ schema,
//   introspection: true,
//   plugins: [
//     ApolloServerPluginUsageReporting(),
//     ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Activa el sandbox
//   ],
// });
const server = new ApolloServer({ schema });
const handler = startServerAndCreateNextHandler(server);

// Rutas GET y POST para el endpoint GraphQL
// Ir a la ruta http://localhost:3000/api/graphql implica hacer un GET al endpoint:
// El metodo GET se requiere para abrir el Apollo SANDBOX
export async function GET(req: NextRequest): Promise<Response> {
  return handler(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req);
}
