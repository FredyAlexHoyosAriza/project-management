import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from '@/graphql';

const server = new ApolloServer({ typeDefs, resolvers });

export const handler = startServerAndCreateNextHandler(server);
