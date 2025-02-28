import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  enum EProjectPhase {
    STARTED
    DEVELOPMENT
    FINISHED
    EMPTY
  }

  enum EObjectiveType {
    GENERAL
    SPECIFIC
  }

  type Objective {
    _id: ID!
    description: String!
    type: EObjectiveType!
    createdAt: Date!
    updatedAt: Date!
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

  # startDate y finishDate son opcionales ya que tienen valor por defecto null, que para
  # graphql implicaría que no existen, y por ende un retorno tipo Project que presente
  # p. ej. finishDate: null no cumpliría con el campo obligatorio finishDate: Date!

  type Project {
    _id: ID!
    name: String!
    leader: User!
    budget: Float!
    isActive: Boolean!
    phase: EProjectPhase!
    objectives: [Objective!]!
    advances: [Advance!]!
    enrollments: [Enrollment!]!
    startDate: Date
    finishDate: Date
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateProjectInput {
    name: String!
    leader: ID!
    budget: Float!
    isActive: Boolean
    phase: EProjectPhase
    objectives: [CreateObjectiveInput!]
    # advances: [ID!] se agregan automáticamente al crear un avance
    # enrollments: [ID!] se agregan automáticamente al crear una inscripción
    startDate: Date
    finishDate: Date
  }

  input UpdateProjectInput {
    name: String
    leader: ID
    budget: Float
    isActive: Boolean
    phase: EProjectPhase
    objectives: [UpdateObjectiveInput!]
    startDate: Date
    finishDate: Date
  }

  type Query {
    getProjects: [Project!]!
    getProjectById(id: ID!): Project
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    finishProject(id: ID!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;
