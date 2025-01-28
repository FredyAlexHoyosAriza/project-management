import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// Importar los typeDefs
import { userTypeDefs } from "../user/typeDefs";
import { enrollmentTypeDefs } from "./enrollment/typeDefs";
import { projectTypeDefs } from "./project/typeDefs";
import { advanceTypeDefs } from "./advance/typeDefs";
import { dateTypeDefs }  from "./dateScalar/typeDefs";

// Importar los resolvers
import { userResolvers } from "../user/resolvers";
import { enrollmentResolvers } from "./enrollment/resolvers";
import { projectResolvers } from "./project/resolvers";
import { advanceResolvers } from "./advance/resolvers";
import { dateResolvers } from "./dateScalar/resolvers";

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