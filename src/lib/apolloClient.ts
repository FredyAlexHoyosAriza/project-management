"use server";// Componente servidor de React

// import { characterQuery } from "@/graphql/client/queries/characterQuery";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

// Configura Apollo Client para React Server Components. Salidas: { getClient, query, PreloadQuery }
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    //Automaticamente toma data de caché, entre tanto busca la info en back y al obtenerla actualiza caché
    cache: new InMemoryCache({ addTypename: false }), 
    link: new HttpLink({
      uri: "/api/graphql", // https://dev-project-management.vercel.app/api/graphql
      // fetchOptions: { // Método HTTP POST por omisión, también hay soporte para GET
      //   method: "POST", // Cambia a "GET" si lo prefieres
      // },
      // credentials: "same-origin", // Opcional: incluye cookies en solicitudes
    }),
  });
});

// const { data } = await getClient().query({ query: characterQuery });
