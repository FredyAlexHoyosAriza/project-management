import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql', // Endpoint del backend
  cache: new InMemoryCache(),
});

export default client;
