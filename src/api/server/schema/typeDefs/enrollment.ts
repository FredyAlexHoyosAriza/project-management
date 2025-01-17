import { gql } from "graphql-tag";

export const enrollmentTypeDefs = gql`
  # Definición del tipo Enrollment
  type Enrollment {
    _id: ID!
    project: Project!
    student: User!
    isAccepted: Boolean!
    entryDate: Date
    exitDate: Date
    createdAt: Date!
    updatedAt: Date!
  }

  # Input para crear una nueva inscripción
  input CreateEnrollmentInput {
    project: ID!
    student: ID!
    isAccepted: Boolean
    entryDate: Date!
    exitDate: Date!
  }

  # Input para actualizar una inscripción
  input UpdateEnrollmentInput {
    isAccepted: Boolean
    entryDate: Date
    exitDate: Date
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
    deleteEnrollment(id: ID!): Boolean!
  }
`;

export default enrollmentTypeDefs;
