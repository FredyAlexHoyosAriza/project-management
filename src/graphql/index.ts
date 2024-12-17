import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// Importar los typeDefs
import { userTypeDefs } from "./typeDefs/user";
import { enrollmentTypeDefs } from "./typeDefs/enrollment";
import { projectTypeDefs } from "./typeDefs/project";
import { advanceTypeDefs } from "./typeDefs/advance";

// Importar los resolvers
import { userResolvers } from "./resolvers/user";
import { enrollmentResolvers } from "./resolvers/enrollment";
import { projectResolvers } from "./resolvers/project";
import { advanceResolvers } from "./resolvers/advance";

// Fusionar todos los typeDefs y resolvers
const typeDefs = mergeTypeDefs([userTypeDefs, enrollmentTypeDefs, projectTypeDefs, advanceTypeDefs]);
const resolvers = mergeResolvers([userResolvers, enrollmentResolvers, projectResolvers, advanceResolvers]);

// Crear el esquema ejecutable
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { typeDefs, resolvers};
