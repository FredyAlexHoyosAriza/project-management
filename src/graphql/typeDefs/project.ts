import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  enum ProjectPhase {
    started
    development
    finished
    empty
  }

  enum ObjectiveType {
    general
    specific
  }

  type Objective {
    _id: ID!
    description: String!
    type: ObjectiveType!
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    _id: ID!
    name: String!
    leader: ID!
    budget: Float!
    isActive: Boolean
    phase: ProjectPhase
    advances: [ID!]
    enrollments: [ID!]
    objectives: [Objective!]
    startDate: String
    finishDate: String
    createdAt: String!
    updatedAt: String!
  }

  input ObjectiveInput {
    description: String!
    type: ObjectiveType!
  }

  input ProjectInput {
    name: String!
    leader: ID!
    budget: Float!
    isActive: Boolean
    phase: ProjectPhase
    advances: [ID!]
    enrollments: [ID!]
    objectives: [ObjectiveInput!]
    startDate: String
    finishDate: String
  }

  input ProjectUpdateInput {
    name: String
    budget: Float
    isActive: Boolean
    phase: ProjectPhase
    objectives: [ObjectiveInput!]
    startDate: String
    finishDate: String
  }

  type Query {
    getProjects: [Project!]!
    getProjectById(id: ID!): Project
  }

  type Mutation {
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectUpdateInput!): Project
    deleteProject(id: ID!): Boolean!
  }
`;
