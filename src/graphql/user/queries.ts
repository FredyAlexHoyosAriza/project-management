// GraphQL query templates
import { gql } from "@apollo/client";

export const GET_USERS = gql`
query GetUsers {
    getUsers {
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
