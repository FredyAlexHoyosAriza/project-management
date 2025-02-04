import { gql } from "@apollo/client";
// Los input y sus tipos son los mismos definidos en los typeDefs

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      surname
      idCard
      email
      role
      state
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      _id
      name
      surname
      idCard
      email
      role
      state
      updatedAt
    }
  }
`;
