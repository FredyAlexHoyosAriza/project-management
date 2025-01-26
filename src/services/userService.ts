import { GET_USERS } from '@/graphql/queries/getUsers';
import { CREATE_USER } from '@/graphql/mutations/createUser';
import { getClient } from '@/lib/apolloClient';

export const fetchUsers = async () => {
  const client = getClient();
  const { data } = await client.query({ query: GET_USERS });
  return data?.getUsers || [];
}

export const createUser = async (userInput: { name: string; email: string }) => {
  const client = getClient();
  const { data } = await client.mutate({
    mutation: CREATE_USER,
    variables: { input: userInput },
  });
  return data?.createUser;
};
