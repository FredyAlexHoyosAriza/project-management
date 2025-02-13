// PARA SERVER COMPONENTS (ROUTER COMPONENTS); window = undefined
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { registerApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { getAuthToken } from "./getAuthToken";

// Crea un authLink que inyecta el header Authorization en cada solicitud.
const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();
  return {
    headers: {
      ...headers,
      // Si existe el token, lo agrega; de lo contrario, envía un string vacío.
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Crea el httpLink para conectar con tu endpoint GraphQL.
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  // fetchOptions: { // Método HTTP POST por omisión, también hay soporte para GET
  //   method: "POST", // Cambia a "GET" si lo prefieres
  // },
  // Solo envía cookies o credenciales si la solicitud se realiza al mismo origen.
  // No permite el envío de credenciales a dominios cruzados (CORS).
  // Aplicaciones donde el frontend y el backend están alojados en el mismo dominio.
  credentials: "same-origin", // Opcional: incluye cookies en solicitudes
});

// Combina authLink y httpLink para formar la cadena de links.
const link = ApolloLink.from([authLink, httpLink]);

// Configura Apollo Client para React Server Components. Salidas: { getClient, query, PreloadQuery }
  // Para el entorno del servidor (SSR), usamos un SSRMultipartLink para soportar directivas como @defer.
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    //Automaticamente toma data de caché, entre tanto busca la info en back y al obtenerla actualiza caché
    cache: new InMemoryCache({ addTypename: false }), 
    link: ApolloLink.from([
      // El SSRMultipartLink elimina las directivas @defer para consultas en SSR.
      new SSRMultipartLink({ stripDefer: true, }),//posible futuro requerimiento
      link,
    ]),
  });
});

// INYECCIÓN DE TOKEN EN AUTHLINK EN apolloCLient y apollo-wrapper, Y VERIFICACIÓN DE TOKEN EN api/graphql

// ¿Por qué es útil tener ambas configuraciones?

// Separación de responsabilidades:

// En el cliente, el authLink se encarga de que cada solicitud lleve la información necesaria para autenticarse.
// En el servidor, getSession() garantiza que solo se atiendan solicitudes de usuarios autenticados, usando un mecanismo confiable (las cookies de sesión).
// Flexibilidad y escalabilidad:

// En el futuro, podrías necesitar que algunos resolvers usen el token enviado en los headers para realizar validaciones adicionales o para interactuar con otros servicios que requieran el token.
// Además, en escenarios donde la autenticación pudiera venir por headers (por ejemplo, en llamadas internas o desde otro cliente), tener el token en el header permite reutilizar esa información.
// Buenas prácticas de seguridad:

// Es preferible tener una verificación en el servidor (basada en cookies o en tokens firmados) que no dependa exclusivamente de la información enviada por el cliente.
// Sin embargo, inyectar el token en el header es una práctica estándar en el manejo de APIs GraphQL, y puede servir para mantener consistencia y facilitar la integración con otros sistemas.
// En resumen, aunque actualmente tu endpoint se base en getSession() para validar la sesión desde la cookie, configurar el authLink en el cliente es útil y se considera una buena práctica. Permite enviar la información de autenticación de forma estándar en cada request y te deja la puerta abierta para escenarios futuros en los que la validación pueda ampliarse o el token se utilice en otras partes de la aplicación.