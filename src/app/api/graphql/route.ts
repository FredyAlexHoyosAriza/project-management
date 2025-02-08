// Este endpoint se encarga de la lógica de negocio.
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/graphql';
import { NextRequest } from 'next/server';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';

// En la arquitectura MVC este archivo representaría una VISTA de un solo endpoint
// Inicialización del servidor Apollo
const server = new ApolloServer({ schema,
   introspection: true,//permite uso apollo sandbox
    // plugins: [
    //   ApolloServerPluginUsageReporting(),//permite registro de métricas; estadística
    //   ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Activa el sandbox incluso en producción; vercel despliegue
    // ],
    plugins: [
      ApolloServerPluginUsageReporting(),
      // Install a landing page plugin based on NODE_ENV
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({//landing page de producción que
            graphRef: 'PMG-7o2qaf@current',//se puede redirigir a este grafo en apollo studio
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),//landing page de desarrollo -> apollo sandbox
    ],
 });
const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    // El middleware ya garantiza que el usuario está autenticado
    return { user: 'Authenticated User' };
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
