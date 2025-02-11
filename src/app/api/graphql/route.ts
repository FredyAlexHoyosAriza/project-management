// Este endpoint se encarga de la lógica de negocio.
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@/api/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { auth0 } from '@/lib/auth0';

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
 // Creamos el handler usando el helper experimental para Next.js.
const handler = startServerAndCreateNextHandler(server, {
  // context: async (req: NextRequest) => {
  //   const session = await auth0.getSession();
  //   if (!session) {
  //     throw new Error('Unauthorized');
  //   }
  //   return { user: session.user };
  // },
});

// Para mayor control y seguridad, también se puede validar la sesión en el endpoint antes de delegar al handler.
// Esto es opcional si confías en que el contexto de Apollo Server se encargará de la validación.
// Rutas GET y POST para el endpoint GraphQL
// Ir a la ruta http://localhost:3000/api/graphql implica hacer un GET al endpoint:
// El metodo GET se requiere para abrir el Apollo SANDBOX
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req);
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    return NextResponse.json({ error:'Internal server error' }, { status: 500 });
  }
}
export async function POST(req: NextRequest): Promise<Response> {
  // try {
  //   const session = await auth0.getSession();
  //   if (!session) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
    return handler(req);
  // } catch (err: any) {
  //   return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  // }
}
