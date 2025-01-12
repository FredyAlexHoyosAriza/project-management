import { gql } from "@apollo/client";
//Todos los pares clave: valor definidos dentro de los parentesis de createAdvance, constituyen
//el objeto args que llega al Mutation createAdvance en el resolver advance.ts. Para extraer
//directamente el campo input se desestructura en los argumentos de entrada { input } 
export const CREATE_ADVANCE = gql`
  mutation CreateAdvance($input: CreateAdvanceInput!) {
    createAdvance(input: $input) {
      project
      student
      description
    }
  }
`;

// Mutation en apollo sandbox
// mutation CreateUser($input: CreateUserInput!) {
//   createUser(input: {email: "donotgobehind@gmail.com"
//     idCard: "1234567"
//     name: "Fredy"
//     surname: "Hoyos"
//     role: LEADER
//     state: AUTHORIZED }) {
//     email
//   }) {
//     email
//   }
// }

// Definicion de input en interfaz variables de apollo sandbox
// {
//   "input": {
//     "email": "beatrizariza7@gmail.com",
//     "idCard": "1434567",
//     "name": "Beatriz",
//     "surname": "Ariza",
//     "role": "STUDENT",
//     "state": "AUTHORIZED"
//   }
// }
//Graphql convierte automaticamente las opciones de enum en strings, por ello deben coincidir
//con los values, de tipo string, de enum definidos para los modelos de mongoose
