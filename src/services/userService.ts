import { GET_USERS } from "@/graphql/user/queries";
import { CREATE_USER } from "@/graphql/user/mutations";
import { getClient } from "@/lib/apolloClient";

export const fetchUsers = async () => {
  try {
    const client = getClient();
    const { data } = await client.query({ query: GET_USERS });
    return data?.getUsers || [];
  } catch { // (error)
    // console.error(error);
    // throw new Error('Error al hacer fetch a colección users');
    return [];
  }
};

export const createUser = async (userInput: {
  name: string;
  email: string;
}) => {
  const client = getClient();
  const { data } = await client.mutate({
    mutation: CREATE_USER,
    variables: { input: userInput },
  });
  return data?.createUser;
};
