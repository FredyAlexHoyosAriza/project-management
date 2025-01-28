// PARA SERVER COMPONENTS (ROUTER COMPONENTS)
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

// Configura Apollo Client para React Server Components. Salidas: { getClient, query, PreloadQuery }
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    //Automaticamente toma data de caché, entre tanto busca la info en back y al obtenerla actualiza caché
    cache: new InMemoryCache({ addTypename: false }), 
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      // fetchOptions: { // Método HTTP POST por omisión, también hay soporte para GET
      //   method: "POST", // Cambia a "GET" si lo prefieres
      // },
      // Solo envía cookies o credenciales si la solicitud se realiza al mismo origen.
      // No permite el envío de credenciales a dominios cruzados (CORS).
      // Aplicaciones donde el frontend y el backend están alojados en el mismo dominio.
      // credentials: "same-origin", // Opcional: incluye cookies en solicitudes
    }),
  });
});

// const { data } = await getClient().query({ query: characterQuery });
