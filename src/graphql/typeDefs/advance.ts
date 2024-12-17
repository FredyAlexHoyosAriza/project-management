import { gql } from "graphql-tag";
//graphql-tag: viene integrado en graphql desde la versión graphql@15

export const advanceTypeDefs = gql`
  # Tipo principal Advance
  type Advance {
    id: ID!
    description: String!
    leaderRemarks: String
    project: ID!          # Relación con Project
    student: ID!          # Relación con User
    createdAt: String!
    updatedAt: String!
  }

  # Inputs para mutaciones (creación y actualización)
  input CreateAdvanceInput {
    description: String!
    leaderRemarks: String
    project: ID!
    student: ID!
  }

  input UpdateAdvanceInput {
    description: String
    leaderRemarks: String
  }

  # Queries y Mutations
  type Query {
    getAdvances: [Advance!]!
    getAdvanceById(id: ID!): Advance
  }

  type Mutation {
    createAdvance(input: CreateAdvanceInput!): Advance!
    updateAdvance(id: ID!, input: UpdateAdvanceInput!): Advance!
    deleteAdvance(id: ID!): Boolean!
  }
`;
