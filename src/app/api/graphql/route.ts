import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/server/schema';
import { NextRequest } from 'next/server';

// En la arquitectura MVC este archivo representaría una VISTA de un solo endpoint
// Inicialización del servidor Apollo
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
