"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";


function makeClient() {
  const httpLink = new HttpLink({
    uri: "/api/graphql",//https://dev-project-management.vercel.app/api/graphql
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined" // En el servidor (backend) window es undefined; el request es del lado del servidor
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink, //Para el front cargado en el navegador window existe
          ])
        : httpLink,
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
