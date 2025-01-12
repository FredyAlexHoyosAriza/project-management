import { gql } from "graphql-tag";

export const enrollmentTypeDefs = gql`
  # Definición del tipo Enrollment
  type Enrollment {
    _id: ID!
    project: ID!
    student: ID!
    isAccepted: Boolean
    entryDate: String!
    exitDate: String!
    createdAt: String!
    updatedAt: String!
  }

  # Input para crear una nueva inscripción
  input CreateEnrollmentInput {
    project: ID!
    student: ID!
    isAccepted: Boolean
    entryDate: String!
    exitDate: String!
  }

  # Input para actualizar una inscripción
  input UpdateEnrollmentInput {
    isAccepted: Boolean
    entryDate: String
    exitDate: String
  }

  # Consultas disponibles
  type Query {
    getEnrollments: [Enrollment!]!
    getEnrollmentById(id: ID!): Enrollment
  }

  # Mutaciones disponibles
  type Mutation {
    createEnrollment(input: CreateEnrollmentInput!): Enrollment!
    updateEnrollment(id: ID!, input: UpdateEnrollmentInput!): Enrollment!
    deleteEnrollment(id: ID!): Enrollment
  }
`;

export default enrollmentTypeDefs;
