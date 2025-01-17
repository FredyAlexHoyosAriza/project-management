import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// Importar los typeDefs
import { userTypeDefs } from "./typeDefs/user";
import { enrollmentTypeDefs } from "./typeDefs/enrollment";
import { projectTypeDefs } from "./typeDefs/project";
import { advanceTypeDefs } from "./typeDefs/advance";
import { dateTypeDefs }  from "./typeDefs/dateScalar";

// Importar los resolvers
import { userResolvers } from "./resolvers/user";
import { enrollmentResolvers } from "./resolvers/enrollment";
import { projectResolvers } from "./resolvers/project";
import { advanceResolvers } from "./resolvers/advance";
import { dateResolvers } from "./resolvers/dateScalar";

// Fusionar todos los typeDefs y resolvers
const typeDefs = mergeTypeDefs([dateTypeDefs, userTypeDefs, enrollmentTypeDefs, projectTypeDefs, advanceTypeDefs]);
const resolvers = mergeResolvers([dateResolvers, userResolvers, enrollmentResolvers, projectResolvers, advanceResolvers]);

// Crear el esquema ejecutable
// Permite crear Mocks (para simular datos en el esquema).
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Un esquema ejecutable es la implementación completa de la API GraphQL que une la descripción
// de los datos (typeDefs) con las funciones que resuelven las operaciones (resolvers). Es el
// corazón de cualquier servidor GraphQL, ya que define qué datos están disponibles, cómo se
// acceden y qué operaciones son posibles.