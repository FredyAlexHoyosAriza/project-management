"use client";
// PARA CLIENT COMPONENTS; window != undefined

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "@auth0/nextjs-auth0";// EN CLIENT ES ASÍ

/**
 * Función para crear el Apollo Client.
 * Se utiliza un authLink para inyectar el token de autenticación en cada request.
 */
function makeClient() {
  // Configuramos el HttpLink para conectar con el endpoint GraphQL.
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    credentials: "include",
  });

  // Configuramos un authLink que inyecta el header Authorization.
  const authLink = setContext(async (_, { headers }) => {// CONTEXTO CSR EN EL CLIENTE
    const token = await getAccessToken();
    return {
      // Apollo establece automáticamente el header "Content-Type": "application/json"
      // para solicitudes que envían un cuerpo JSON
      headers: {
        ...headers,
        // "Content-Type": "application/json",
        // Si hay token, lo inyectamos como Bearer token; de lo contrario, enviamos cadena vacía.
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Combinamos authLink y httpLink.
  const combinedLink = authLink.concat(httpLink);

  // Para el entorno del servidor (SSR), usamos un SSRMultipartLink para soportar directivas como @defer.
  // En el cliente, utilizamos directamente la cadena combinada.
  return new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: combinedLink,
  });
}

/**
 * Componente wrapper que utiliza ApolloNextAppProvider para inyectar el Apollo Client.
 * Este componente se usa en el cliente, por lo que no debe importar nada del código de SSR.
 */
export function ApolloWrapper({ children }: React.PropsWithChildren) {

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
