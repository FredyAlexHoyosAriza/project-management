import { gql } from "graphql-tag";

export const userTypeDefs = gql`

  enum ERole {
    STUDENT
    LEADER
    MANAGER
  }

  enum EState {
    PENDING
    AUTHORIZED
    UNAUTHORIZED
  }

  type User {
    _id: ID!
    name: String!
    surname: String!
    idCard: String!
    email: String!
    role: ERole!
    state: EState!
    # assignedProjects: [Project!]!
    leaderships: [Project!]!
    inscriptions: [Enrollment!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateUserInput {
    email: String!
    idCard: String!
    name: String!
    surname: String!
    role: ERole!
    state: EState
  }

  input UpdateUserInput {
    email: String
    idCard: String
    name: String
    surname: String
    role: ERole
    state: EState
  }

  type Query {
    getUsers: [User!]!
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    setUserState(id: ID!, state: EState): User!
  }
`;
