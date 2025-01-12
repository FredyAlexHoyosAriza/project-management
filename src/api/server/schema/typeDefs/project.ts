import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  enum EProjectPhase {
    STARTED
    DEVELOPMENT
    FINISHED
    NULL
  }

  enum EObjectiveType {
    GENERAL
    SPECIFIC
  }

  type Objective {
    _id: ID!
    description: String!
    type: EObjectiveType!
    createdAt: String!
    updatedAt: String!
  }

  input CreateObjectiveInput {
    description: String!
    type: EObjectiveType!
  }

  input UpdateObjectiveInput {
    _id: ID
    description: String
    type: EObjectiveType
  }

  type Project {
    _id: ID!
    name: String!
    leader: ID!
    budget: Float!
    isActive: Boolean!
    phase: EProjectPhase!
    objectives: [Objective!]!
    advances: [ID!]!
    enrollments: [ID!]!
    startDate: String
    finishDate: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjectInput {
    name: String!
    leader: ID!
    budget: Float!
    isActive: Boolean
    phase: EProjectPhase
    objectives: [CreateObjectiveInput!]
    advances: [ID!]
    enrollments: [ID!]
    startDate: String
    finishDate: String
  }

  input UpdateProjectInput {
    name: String
    budget: Float
    isActive: Boolean
    phase: EProjectPhase
    objectives: [UpdateObjectiveInput!]
    startDate: String
    finishDate: String
  }

  type Query {
    getProjects: [Project!]!
    getProjectById(id: ID!): Project
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;
