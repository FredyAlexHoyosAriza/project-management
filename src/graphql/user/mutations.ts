// GraphQL mutation templates
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

export const REGISTER_USER = gql`
  mutation RegisterUser($input: CreateUserInput!) {
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
    updateUser(id: $id, user_id: $user_id, input: $input) {
      _id
      user_id
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
export const SET_USER_STATE = gql`
  mutation SetUserState($id: ID!, $user_id: ID!, $state: EState) {
    setUserState(id: $id, user_id: $user_id, state: $state) {
      _id
      user_id
      name
      surname
      idCard
      email
      role
      state
      updatedAt
    }
  }
`

