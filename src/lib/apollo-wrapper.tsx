"use client";
// PARA CLIENT COMPONENTS; window != undefined

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

/**
 * Función para crear el Apollo Client.
 * Se utiliza un authLink para inyectar el token de autenticación en cada request.
 */
function makeClient() {
  // Configuramos el HttpLink para conectar con el endpoint GraphQL.
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    credentials: "same-origin", // Enviar cookies si es necesario
  });

  // Configuramos un authLink que inyecta el header Authorization.
  const authLink = setContext(async (_, { headers }) => {
    // En el entorno del cliente, usamos js-cookie para obtener el token.
    const token = Cookies.get('__session') || "";
    return {
      headers: {
        ...headers,
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

