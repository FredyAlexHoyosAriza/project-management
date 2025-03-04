import { gql } from "graphql-tag";
//graphql-tag: viene integrado en graphql desde la versión graphql@15

export const advanceTypeDefs = gql`
  # Tipo principal Advance
  # type se usa para definir tipos de retorno; sus tipos internos (que incluyen enum,
  # String, Int, Float, ID, Boolean, etc) son nativos de graphql o definidos con type
  type Advance {
    _id: ID!
    description: String!
    leaderRemarks: String!
    project: Project!          # Relación con Project
    student: User!          # Relación con User
    createdAt: Date
    updatedAt: Date
  }

  # Inputs para mutaciones (creación y actualización)
  # input se usa para definir tipos de input (argumento de entrada); sus tipos internos (que
  # incluyen enum, String, Int, Float, ID, Boolean) son nativos de graphql o definidos con input
  input CreateAdvanceInput {
    description: String!
    # leaderRemarks: String
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
