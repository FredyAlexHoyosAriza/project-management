import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  enum Role {
    student
    leader
    manager
  }

  enum State {
    pending
    authorized
    unauthorized
  }

  type User {
    _id: ID!
    email: String!
    idCard: String!
    name: String!
    surname: String!
    role: Role!
    state: State!
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    email: String!
    idCard: String!
    name: String!
    surname: String!
    role: Role!
    state: State
  }

  input UserUpdateInput {
    email: String
    idCard: String
    name: String
    surname: String
    role: Role
    state: State
  }

  type Query {
    getUsers: [User!]!
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserUpdateInput!): User
    deleteUser(id: ID!): Boolean!
  }
`;
