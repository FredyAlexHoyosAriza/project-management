"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
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
    let token = "";
    // Garantiza que solo se ejecute en el cliente
    if (typeof window !== "undefined") {
      // Se obtiene el token crudo desde la cookie __session
      token = Cookies.get('__session') || "";
    }
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
    link:
      typeof window === "undefined" // En el servidor (backend) window es undefined; el request es del lado del servidor
        ? ApolloLink.from([
            // El SSRMultipartLink elimina las directivas @defer para consultas en SSR.
            new SSRMultipartLink({ stripDefer: true, }),
            combinedLink, //Para el front cargado en el navegador window existe
          ])
        : httpLink,//combinedLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

// import { ApolloProvider } from "@apollo/client";
// import { getClient } from "@/lib/apolloClient";

// export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
//   const client = getClient(); // Obtiene la instancia del ApolloClient configurada en el servidor
//   return <ApolloProvider client={client}>{children}</ApolloProvider>;
// }
