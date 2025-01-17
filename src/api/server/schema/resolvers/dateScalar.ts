import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar for handling Date objects",
  serialize(value: unknown) {
    if (!(value instanceof Date)) {
      throw new Error("Date scalar can only serialize Date objects");
    }
    return value.toISOString(); // Convert Date to ISO string
  },

  parseValue(value: unknown) {
    // if (value instanceof Date) return value;
    if (typeof value !== "string") {
      throw new Error("Date scalar can only parse string values");
    }  
    // Formatos soportados
    // ISO 8601: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
    // Formato simple (yyyy-MM-dd): /^\d{4}-\d{2}-\d{2}$/
    // Formato común (MM/dd/yyyy o dd/MM/yyyy): /^\d{2}\/\d{2}\/\d{4}$/

    // Validar el valor contra los formatos soportados y procesarlo
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return new Date(value); // ISO 8601
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00Z`); // yyyy-MM-dd (agrega tiempo por defecto)
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      // Convertir MM/dd/yyyy o dd/MM/yyyy a un objeto Date
      const [part1, part2, part3] = value.split("/");
      const isUSFormat = parseInt(part1, 10) > 12; // Determinar si es dd/MM/yyyy
      const year = parseInt(part3, 10);
      const month = parseInt(isUSFormat ? part2 : part1, 10) - 1; // Meses van de 0 a 11
      const day = parseInt(isUSFormat ? part1 : part2, 10);
      return new Date(Date.UTC(year, month, day));
    }
    throw new Error(
      `Invalid date format. Supported formats are: ISO 8601, yyyy-MM-dd, MM/dd/yyyy, dd/MM/yyyy`
    );
  },  

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Date scalar can only parse string literals");
    }
    return new Date(ast.value); // Convert AST string to Date
  },
});

export const dateResolvers = {
  Date: dateScalar, // Escalar personalizado para fechas
};
